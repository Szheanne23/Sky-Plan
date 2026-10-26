import React, { useState, useEffect } from 'react';
import { CalendarPlus, MapPin, Clock, Plus, Check, AlertCircle, X, Sparkles } from 'lucide-react';
import itineraryService from '../../services/itineraryService';
import Button from '../common/Button';
import Input from '../common/Input';
import DestinationAutocomplete from '../common/DestinationAutocomplete';
import BookingDateRangePicker, { ActivityTimePicker } from '../common/BookingDateRangePicker';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddToItineraryModal({
  isOpen,
  onClose,
  activity,
  destinationCity = 'Manila',
  onSuccess,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [itineraries, setItineraries] = useState([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Itinerary Fields
  const [newTitle, setNewTitle] = useState(`Trip to ${destinationCity}`);
  const [newCity, setNewCity] = useState(destinationCity);
  const [newOccasion, setNewOccasion] = useState('Vacation');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Activity fields
  const [timeSlot, setTimeSlot] = useState('Morning (09:00 - 12:00)');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const occasions = [
    'Vacation',
    'Weekend Getaway',
    'Adventure Trip',
    'Family Outing',
    'Solo Exploration',
    'Road Trip',
    'Cultural & Sightseeing',
    'Business & Leisure',
  ];

  const timeSlotOptions = [
    'Morning (09:00 - 12:00)',
    'Midday / Lunch (12:00 - 14:00)',
    'Afternoon (14:00 - 18:00)',
    'Evening (18:00 - 21:00)',
    'Night (21:00+)',
    'Full Day Excursion',
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (!isAuthenticated) {
      onClose();
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/register?redirect=${encodeURIComponent(currentPath)}`);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    setError(null);
    setSuccessMsg(null);
    setNewTitle(`Trip to ${destinationCity}`);
    itineraryService.getItineraries().then((list) => {
      setItineraries(list);
      if (list && list.length > 0) {
        // Preselect matching city itinerary if available, or first one
        const match = list.find((it) => it.destination_city.toLowerCase() === destinationCity.toLowerCase());
        setSelectedItineraryId(match ? match.id : list[0].id);
        setIsCreatingNew(false);
      } else {
        setIsCreatingNew(true);
      }
    }).catch((err) => {
      setError('Failed to fetch itineraries.');
    });

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, destinationCity, isAuthenticated, navigate, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/register?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let targetItineraryId = selectedItineraryId;

      if (isCreatingNew) {
        if (!newTitle.trim()) {
          throw new Error('Please enter a title for the new itinerary.');
        }

        const created = await itineraryService.createItinerary({
          title: newTitle.trim(),
          destinationCity: (newCity || destinationCity).trim(),
          occasion: newOccasion,
          startDate: newStartDate || null,
          endDate: newEndDate || null,
        });
        targetItineraryId = created.id;
      }

      if (!targetItineraryId) {
        throw new Error('Please select or create an itinerary.');
      }

      await itineraryService.addActivity(targetItineraryId, {
        title: activity.title,
        category: activity.category || 'OUTDOOR',
        suitability: activity.suitability || 'OPTIMAL',
        timeSlot,
        notes: notes.trim() || null,
        locationName: destinationCity,
      });

      setSuccessMsg(`"${activity.title}" saved to your itinerary!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to add activity to itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-itinerary-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-low border border-white/15 shadow-glass-hover p-5 sm:p-8 space-y-5 text-on-surface">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="add-itinerary-modal-title" className="font-display text-lg font-bold text-on-surface">
                Add to Itinerary
              </h3>
              <p className="text-xs text-outline">
                Curate this activity into your timeline for {destinationCity}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Activity Preview Capsule */}
        <div className="p-3.5 rounded-2xl bg-surface-container-high/80 border border-white/10 flex items-center justify-between gap-3 text-xs shadow-specular-inset">
          <div>
            <h4 className="font-bold text-on-surface font-display text-sm">{activity?.title}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-outline">
              <span>{activity?.category || 'OUTDOOR'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-primary">
                <MapPin className="w-3 h-3" /> {destinationCity}
              </span>
            </div>
          </div>
          <Badge variant={activity?.suitability === 'OPTIMAL' ? 'optimal' : 'primary'} size="sm">
            {activity?.suitability || 'RECOMMENDED'}
          </Badge>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-optimal/20 border border-optimal/30 text-optimal text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-outline">
              Sign in to save this activity to your personalized itineraries and timelines.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Sign In to Save
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Itinerary Selection or Create Mode */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-on-surface">Target Itinerary</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(!isCreatingNew)}
                  className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  {isCreatingNew ? 'Choose Existing' : '+ Create New Itinerary'}
                </button>
              </div>

              {!isCreatingNew && itineraries.length > 0 ? (
                <select
                  value={selectedItineraryId}
                  onChange={(e) => setSelectedItineraryId(e.target.value)}
                  className="w-full rounded-2xl bg-surface-container-high border border-white/10 px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  {itineraries.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.title} ({it.destination_city} • {it.occasion})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2.5 p-3 rounded-2xl bg-surface-container-high/60 border border-white/10">
                  <div>
                    <label className="text-[11px] font-medium text-outline block mb-1">Itinerary Name</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Summer Vacation in Siargao"
                      required
                      className="w-full rounded-xl bg-surface-container border border-white/10 px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <DestinationAutocomplete
                      label="Destination"
                      value={newCity}
                      onChange={(city) => setNewCity(city)}
                      onSelectDestination={(dest) => {
                        setNewCity(dest.city);
                        if (!newTitle || newTitle.startsWith('Trip to ')) {
                          setNewTitle(`Trip to ${dest.city}`);
                        }
                      }}
                      placeholder="Search destination (e.g. Baguio, Siargao)..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-outline block mb-1">Occasion</label>
                    <select
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      className="w-full rounded-xl bg-surface-container border border-white/10 px-2.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    >
                      {occasions.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Booking Date Range Picker */}
                  <BookingDateRangePicker
                    startDate={newStartDate}
                    endDate={newEndDate}
                    onStartDateChange={(startStr) => setNewStartDate(startStr)}
                    onEndDateChange={(endStr) => setNewEndDate(endStr)}
                    defaultDurationDays={2}
                  />
                </div>
              )}
            </div>

            {/* Time Slot Selection with ActivityTimePicker */}
            <ActivityTimePicker
              value={timeSlot}
              onChange={(val) => setTimeSlot(val)}
            />

            {/* Notes Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-on-surface">Planning Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bring hiking boots, book passes in advance..."
                rows={2}
                className="w-full rounded-2xl bg-surface-container-high border border-white/10 p-3 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-outline resize-none"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={CalendarPlus}
                isLoading={isLoading}
              >
                Save to Itinerary
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
