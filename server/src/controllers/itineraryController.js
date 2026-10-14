const crypto = require('crypto');
const { query, pool } = require('../config/db');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/itineraries
 * Lists all itineraries for the authenticated user with activity count.
 */
async function getItineraries(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT i.*, 
              COUNT(ia.id)::int as activity_count,
              COUNT(CASE WHEN ia.is_completed THEN 1 END)::int as completed_count
       FROM itineraries i
       LEFT JOIN itinerary_activities ia ON ia.itinerary_id = i.id
       WHERE i.user_id = $1
       GROUP BY i.id
       ORDER BY i.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        itineraries: result.rows,
        total: result.rows.length,
      },
      message: 'Itineraries retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/itineraries/:id
 * Retrieves a single itinerary and all its activities.
 */
async function getItineraryById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid itinerary ID is required.',
        },
      });
    }

    const itinResult = await query(
      `SELECT * FROM itineraries WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (itinResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    const activitiesResult = await query(
      `SELECT * FROM itinerary_activities
       WHERE itinerary_id = $1
       ORDER BY order_index ASC, created_at ASC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        itinerary: itinResult.rows[0],
        activities: activitiesResult.rows,
      },
      message: 'Itinerary retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/itineraries
 * Creates a new itinerary, optionally with initial activities.
 */
async function createItinerary(req, res, next) {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const {
      title,
      destinationCity,
      countryCode,
      occasion,
      startDate,
      endDate,
      description,
      activities = [],
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Itinerary title is required.',
        },
      });
    }

    if (!destinationCity || typeof destinationCity !== 'string' || destinationCity.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Destination city is required.',
        },
      });
    }

    await client.query('BEGIN');

    // Generate unique share code
    const shareCode = crypto.randomBytes(8).toString('hex');

    const itinResult = await client.query(
      `INSERT INTO itineraries (
        user_id, title, destination_city, country_code, occasion, start_date, end_date, description, share_code
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        title.trim(),
        destinationCity.trim(),
        countryCode ? countryCode.trim() : null,
        occasion ? occasion.trim() : 'Vacation',
        startDate || null,
        endDate || null,
        description ? description.trim() : null,
        shareCode,
      ]
    );

    const newItinerary = itinResult.rows[0];
    const insertedActivities = [];

    if (Array.isArray(activities) && activities.length > 0) {
      for (let i = 0; i < activities.length; i++) {
        const act = activities[i];
        if (act && act.title) {
          const actRes = await client.query(
            `INSERT INTO itinerary_activities (
              itinerary_id, title, time_slot, target_date, category, suitability, notes, location_name, estimated_duration, order_index
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
              newItinerary.id,
              act.title.trim(),
              act.timeSlot || 'Morning',
              act.targetDate || newItinerary.start_date || null,
              act.category || 'OUTDOOR',
              act.suitability || 'OPTIMAL',
              act.notes || null,
              act.locationName || destinationCity.trim(),
              act.estimatedDuration || null,
              i,
            ]
          );
          insertedActivities.push(actRes.rows[0]);
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        itinerary: newItinerary,
        activities: insertedActivities,
      },
      message: 'Itinerary created successfully.',
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

/**
 * PUT /api/itineraries/:id
 * Updates an existing itinerary.
 */
async function updateItinerary(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      title,
      destinationCity,
      countryCode,
      occasion,
      startDate,
      endDate,
      description,
      isPublic,
    } = req.body;

    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid itinerary ID is required.',
        },
      });
    }

    const check = await query('SELECT * FROM itineraries WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    const existing = check.rows[0];

    const result = await query(
      `UPDATE itineraries
       SET title = $1,
           destination_city = $2,
           country_code = $3,
           occasion = $4,
           start_date = $5,
           end_date = $6,
           description = $7,
           is_public = COALESCE($8, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        title !== undefined ? title.trim() : existing.title,
        destinationCity !== undefined ? destinationCity.trim() : existing.destination_city,
        countryCode !== undefined ? countryCode : existing.country_code,
        occasion !== undefined ? occasion.trim() : existing.occasion,
        startDate !== undefined ? (startDate || null) : existing.start_date,
        endDate !== undefined ? (endDate || null) : existing.end_date,
        description !== undefined ? description : existing.description,
        isPublic !== undefined ? Boolean(isPublic) : null,
        id,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      data: {
        itinerary: result.rows[0],
      },
      message: 'Itinerary updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/itineraries/:id
 * Deletes an itinerary and its associated activities.
 */
async function deleteItinerary(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid itinerary ID is required.',
        },
      });
    }

    const result = await query(
      `DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING id, title`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found or already deleted.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deletedId: id,
        title: result.rows[0].title,
      },
      message: `Itinerary "${result.rows[0].title}" deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/itineraries/:id/activities
 * Adds a new activity/item to an itinerary.
 */
async function addActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      title,
      timeSlot,
      targetDate,
      category,
      suitability,
      notes,
      locationName,
      estimatedDuration,
    } = req.body;

    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid itinerary ID is required.',
        },
      });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Activity title is required.',
        },
      });
    }

    // Verify ownership
    const itinCheck = await query('SELECT * FROM itineraries WHERE id = $1 AND user_id = $2', [id, userId]);
    if (itinCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    // Determine order_index
    const countRes = await query('SELECT COUNT(*)::int as count FROM itinerary_activities WHERE itinerary_id = $1', [id]);
    const nextOrder = countRes.rows[0]?.count || 0;

    const actRes = await query(
      `INSERT INTO itinerary_activities (
        itinerary_id, title, time_slot, target_date, category, suitability, notes, location_name, estimated_duration, order_index
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        id,
        title.trim(),
        timeSlot ? timeSlot.trim() : 'Morning',
        targetDate || itinCheck.rows[0].start_date || null,
        category ? category.trim() : 'OUTDOOR',
        suitability ? suitability.trim() : 'OPTIMAL',
        notes ? notes.trim() : null,
        locationName ? locationName.trim() : itinCheck.rows[0].destination_city,
        estimatedDuration ? estimatedDuration.trim() : null,
        nextOrder,
      ]
    );

    // Touch itinerary updated_at
    await query('UPDATE itineraries SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.status(201).json({
      success: true,
      data: {
        activity: actRes.rows[0],
      },
      message: 'Activity added to itinerary.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/itineraries/:id/activities/:activityId
 * Updates an activity (e.g. toggle completion, change time slot, notes).
 */
async function updateActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const { id, activityId } = req.params;
    const {
      title,
      timeSlot,
      targetDate,
      category,
      suitability,
      notes,
      locationName,
      estimatedDuration,
      isCompleted,
      orderIndex,
    } = req.body;

    if (!id || !UUID_REGEX.test(id) || !activityId || !UUID_REGEX.test(activityId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Valid itinerary and activity IDs are required.',
        },
      });
    }

    // Verify ownership
    const itinCheck = await query('SELECT id FROM itineraries WHERE id = $1 AND user_id = $2', [id, userId]);
    if (itinCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    const existingAct = await query(
      'SELECT * FROM itinerary_activities WHERE id = $1 AND itinerary_id = $2',
      [activityId, id]
    );

    if (existingAct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Activity item not found in this itinerary.',
        },
      });
    }

    const cur = existingAct.rows[0];

    const result = await query(
      `UPDATE itinerary_activities
       SET title = $1,
           time_slot = $2,
           target_date = $3,
           category = $4,
           suitability = $5,
           notes = $6,
           location_name = $7,
           estimated_duration = $8,
           is_completed = COALESCE($9, is_completed),
           order_index = COALESCE($10, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND itinerary_id = $12
       RETURNING *`,
      [
        title !== undefined ? title.trim() : cur.title,
        timeSlot !== undefined ? timeSlot.trim() : cur.time_slot,
        targetDate !== undefined ? (targetDate || null) : cur.target_date,
        category !== undefined ? category.trim() : cur.category,
        suitability !== undefined ? suitability.trim() : cur.suitability,
        notes !== undefined ? notes : cur.notes,
        locationName !== undefined ? locationName : cur.location_name,
        estimatedDuration !== undefined ? estimatedDuration : cur.estimated_duration,
        isCompleted !== undefined ? Boolean(isCompleted) : null,
        orderIndex !== undefined ? Number(orderIndex) : null,
        activityId,
        id,
      ]
    );

    await query('UPDATE itineraries SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      data: {
        activity: result.rows[0],
      },
      message: 'Activity updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/itineraries/:id/activities/:activityId
 * Removes an activity from an itinerary.
 */
async function deleteActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const { id, activityId } = req.params;

    if (!id || !UUID_REGEX.test(id) || !activityId || !UUID_REGEX.test(activityId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Valid itinerary and activity IDs are required.',
        },
      });
    }

    // Verify ownership
    const itinCheck = await query('SELECT id FROM itineraries WHERE id = $1 AND user_id = $2', [id, userId]);
    if (itinCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    const delRes = await query(
      'DELETE FROM itinerary_activities WHERE id = $1 AND itinerary_id = $2 RETURNING id, title',
      [activityId, id]
    );

    if (delRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Activity not found in this itinerary.',
        },
      });
    }

    await query('UPDATE itineraries SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      data: {
        deletedId: activityId,
        title: delRes.rows[0].title,
      },
      message: `Activity "${delRes.rows[0].title}" removed from itinerary.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/itineraries/:id/share
 * Generates or activates share link for an itinerary.
 */
async function shareItinerary(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid itinerary ID is required.',
        },
      });
    }

    const itinCheck = await query('SELECT * FROM itineraries WHERE id = $1 AND user_id = $2', [id, userId]);
    if (itinCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Itinerary not found.',
        },
      });
    }

    let shareCode = itinCheck.rows[0].share_code;
    if (!shareCode) {
      shareCode = crypto.randomBytes(8).toString('hex');
    }

    const updated = await query(
      `UPDATE itineraries
       SET share_code = $1, is_public = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [shareCode, id]
    );

    res.status(200).json({
      success: true,
      data: {
        shareCode: updated.rows[0].share_code,
        shareUrl: `/shared/${updated.rows[0].share_code}`,
        itinerary: updated.rows[0],
      },
      message: 'Itinerary is now ready to share.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/itineraries/shared/:shareCode
 * Public endpoint allowing anyone to view a shared itinerary.
 */
async function getSharedItinerary(req, res, next) {
  try {
    const { shareCode } = req.params;

    if (!shareCode || typeof shareCode !== 'string' || shareCode.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A share code is required.',
        },
      });
    }

    const itinRes = await query(
      `SELECT i.*, p.display_name as creator_name, p.avatar_url as creator_avatar
       FROM itineraries i
       JOIN users u ON u.id = i.user_id
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE i.share_code = $1`,
      [shareCode.trim()]
    );

    if (itinRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Shared itinerary not found or the link has expired.',
        },
      });
    }

    const itinerary = itinRes.rows[0];

    const activitiesRes = await query(
      `SELECT * FROM itinerary_activities
       WHERE itinerary_id = $1
       ORDER BY order_index ASC, created_at ASC`,
      [itinerary.id]
    );

    res.status(200).json({
      success: true,
      data: {
        itinerary,
        activities: activitiesRes.rows,
      },
      message: 'Shared itinerary retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addActivity,
  updateActivity,
  deleteActivity,
  shareItinerary,
  getSharedItinerary,
};
