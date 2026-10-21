import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Share2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Filter, 
  Search, 
  AlertCircle,
  X,
  ChevronRight,
  ListTodo,
  Layers,
  CalendarCheck2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import itineraryService from '../services/itineraryService';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import DestinationAutocomplete from '../components/common/DestinationAutocomplete';
import BookingDateRangePicker, { ActivityTimePicker } from '../components/common/BookingDateRangePicker';

export default function ItinerariesPage() {
  const [searchParams] = useSearchParams();
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null); // null = new, object = edit

  // Timeline / Detail Drawer
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [timelineActivities, setTimelineActivities] = useState([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  // Add Activity inside Timeline
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTimeSlot, setNewActivityTimeSlot] = useState('Morning');
  const [newActivityCategory, setNewActivityCategory] = useState('OUTDOOR');
  const [newActivitySuitability, setNewActivitySuitability] = useState('OPTIMAL');
  const [newActivityNotes, setNewActivityNotes] = useState('');
  const [newActivityLocation, setNewActivityLocation] = useState('');

  // Share Dialog state
  const [shareDialogData, setShareDialogData] = useState(null); // { itinerary, shareUrl }
  const [copySuccess, setCopySuccess] = useState(false);

  // Form State for Itinerary
  const [formTitle, setFormTitle] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formOccasion, setFormOccasion] = useState('Vacation');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const occasions = [
    'ALL',
    'Vacation',
    'Weekend Getaway',
    'Adventure Trip',
    'Family Outing',
    'Solo Exploration',
    'Road Trip',
    'Cultural & Sightseeing',
    'Business & Leisure',
  ];

  const fetchItineraries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await itineraryService.getItineraries();
      setItineraries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load itineraries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();

    // Check if redirect requested creation of a new itinerary
    const createParam = searchParams.get('create');
    const cityParam = searchParams.get('city');
    if (createParam === 'true' || cityParam) {
      setEditingItinerary(null);
      const targetCity = cityParam ? decodeURIComponent(cityParam) : '';
      setFormCity(targetCity);
      setFormTitle(targetCity ? `Trip to ${targetCity}` : 'My Philippine Getaway');
      setFormCountry('PH');
      setFormOccasion('Vacation');
      setFormStartDate('');
      setFormEndDate('');
      setFormDescription('');
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingItinerary(null);
    setFormTitle('');
    setFormCity('');
    setFormCountry('');
    setFormOccasion('Vacation');
    setFormStartDate('');
    setFormEndDate('');
    setFormDescription('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (itinerary) => {
    setEditingItinerary(itinerary);
    setFormTitle(itinerary.title || '');
    setFormCity(itinerary.destination_city || '');
    setFormCountry(itinerary.country_code || '');
    setFormOccasion(itinerary.occasion || 'Vacation');
    setFormStartDate(itinerary.start_date ? itinerary.start_date.split('T')[0] : '');
    setFormEndDate(itinerary.end_date ? itinerary.end_date.split('T')[0] : '');
    setFormDescription(itinerary.description || '');
    setIsCreateModalOpen(true);
  };

  const handleSaveItinerary = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCity.trim()) {
      alert('Please provide a title and destination city.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        destinationCity: formCity.trim(),
        countryCode: formCountry.trim() || null,
        occasion: formOccasion,
        startDate: formStartDate || null,
        endDate: formEndDate || null,
        description: formDescription.trim() || null,
      };

      if (editingItinerary) {
        await itineraryService.updateItinerary(editingItinerary.id, payload);
      } else {
        await itineraryService.createItinerary(payload);
      }

      setIsCreateModalOpen(false);
      fetchItineraries();
    } catch (err) {
      alert(err.message || 'Failed to save itinerary.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItinerary = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await itineraryService.deleteItinerary(id);
      setItineraries((prev) => prev.filter((it) => it.id !== id));
      if (selectedItinerary?.id === id) {
        setSelectedItinerary(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete itinerary.');
    }
  };

  // Timeline & Activities Drawer
  const openTimeline = async (itinerary) => {
    setSelectedItinerary(itinerary);
    setIsLoadingTimeline(true);
    setIsAddingActivity(false);
    setNewActivityLocation(itinerary.destination_city);
    try {
      const data = await itineraryService.getItinerary(itinerary.id);
      setTimelineActivities(data.activities || []);
    } catch (err) {
      alert(err.message || 'Failed to load timeline activities.');
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  const handleToggleActivity = async (activity) => {
    try {
      const nextState = !activity.is_completed;
      await itineraryService.updateActivity(selectedItinerary.id, activity.id, {
        isCompleted: nextState,
      });

      setTimelineActivities((prev) =>
        prev.map((a) => (a.id === activity.id ? { ...a, is_completed: nextState } : a))
      );

      // Update itinerary count in state
      setItineraries((prev) =>
        prev.map((it) => {
          if (it.id === selectedItinerary.id) {
            const completedDelta = nextState ? 1 : -1;
            return {
              ...it,
              completed_count: Math.max(0, (it.completed_count || 0) + completedDelta),
            };
          }
          return it;
        })
      );
    } catch (err) {
      alert(err.message || 'Failed to update activity status.');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    try {
      const added = await itineraryService.addActivity(selectedItinerary.id, {
        title: newActivityTitle.trim(),
        timeSlot: newActivityTimeSlot,
        category: newActivityCategory,
        suitability: newActivitySuitability,
        locationName: newActivityLocation.trim() || selectedItinerary.destination_city,
        notes: newActivityNotes.trim() || null,
      });

      setTimelineActivities((prev) => [...prev, added]);
      setNewActivityTitle('');
      setNewActivityNotes('');
      setIsAddingActivity(false);

      // Increment count on list
      setItineraries((prev) =>
        prev.map((it) =>
          it.id === selectedItinerary.id
            ? { ...it, activity_count: (it.activity_count || 0) + 1 }
            : it
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to add activity.');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Remove this activity from the itinerary?')) return;
    try {
      await itineraryService.deleteActivity(selectedItinerary.id, activityId);
      setTimelineActivities((prev) => prev.filter((a) => a.id !== activityId));
      setItineraries((prev) =>
        prev.map((it) =>
          it.id === selectedItinerary.id
            ? { ...it, activity_count: Math.max(0, (it.activity_count || 1) - 1) }
            : it
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to delete activity.');
    }
  };

  // Sharing
  const handleShare = async (itinerary) => {
    try {
      const res = await itineraryService.shareItinerary(itinerary.id);
      const shareUrl = `${window.location.origin}/shared/${res.shareCode}`;
      setShareDialogData({
        itinerary,
        shareUrl,
        shareCode: res.shareCode,
      });
      setCopySuccess(false);
    } catch (err) {
      alert(err.message || 'Failed to generate share link.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Filter itineraries
  const filteredItineraries = itineraries.filter((it) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.destination_city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOccasion =
      selectedOccasion === 'ALL' || it.occasion === selectedOccasion;

    return matchesSearch && matchesOccasion;
  });

  const totalActivitiesCount = itineraries.reduce((sum, it) => sum + (it.activity_count || 0), 0);
  const totalCompletedCount = itineraries.reduce((sum, it) => sum + (it.completed_count || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider shadow-specular-inset">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              Itinerary & Timeline Planner
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            My Saved Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-outline">
            Save, edit, and share personalized multi-destination timelines for your holidays and occasions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={openCreateModal}
        >
          Create New Itinerary
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/10 shadow-specular-inset">
          <span className="text-[11px] font-bold uppercase text-outline">Itineraries</span>
          <div className="font-display text-2xl font-extrabold text-on-surface mt-1">
            {itineraries.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/10 shadow-specular-inset">
          <span className="text-[11px] font-bold uppercase text-outline">Destinations</span>
          <div className="font-display text-2xl font-extrabold text-primary mt-1">
            {new Set(itineraries.map((it) => it.destination_city)).size}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/10 shadow-specular-inset">
          <span className="text-[11px] font-bold uppercase text-outline">Activities Planned</span>
          <div className="font-display text-2xl font-extrabold text-tertiary mt-1">
            {totalActivitiesCount}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/10 shadow-specular-inset">
          <span className="text-[11px] font-bold uppercase text-outline">Completed</span>
          <div className="font-display text-2xl font-extrabold text-optimal mt-1">
            {totalCompletedCount}
          </div>
        </div>
      </div>

      {/* Search & Occasion Filter Capsule */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter itineraries by city or title..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-high/80 border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-outline"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {occasions.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedOccasion === occ
                    ? 'bg-primary-container text-on-primary-container shadow-glow'
                    : 'bg-surface-container text-outline hover:text-on-surface'
                }`}
              >
                {occ === 'ALL' ? 'All Occasions' : occ}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Itineraries List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton variant="rectangle" count={3} />
        </div>
      ) : filteredItineraries.length === 0 ? (
        <EmptyState
          title="No itineraries found"
          description={
            searchQuery || selectedOccasion !== 'ALL'
              ? 'Try modifying your search or occasion filters.'
              : 'You haven’t created any itineraries yet. Plan a trip or save suggestions from the dashboard!'
          }
          icon={CalendarCheck2}
          action={
            <Button variant="primary" icon={Plus} onClick={openCreateModal}>
              Create First Itinerary
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItineraries.map((it) => {
            const hasDates = it.start_date || it.end_date;
            const dateStr = hasDates
              ? `${it.start_date ? new Date(it.start_date).toLocaleDateString() : 'Flexible'} ${
                  it.end_date ? `– ${new Date(it.end_date).toLocaleDateString()}` : ''
                }`
              : 'Flexible Dates';

            const completionRate =
              it.activity_count > 0
                ? Math.round(((it.completed_count || 0) / it.activity_count) * 100)
                : 0;

            return (
              <div
                key={it.id}
                className="rounded-3xl bg-surface-container-low/80 backdrop-blur-md p-6 border border-white/10 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group shadow-glass relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Bar: Occasion Badge + Actions Menu */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold tracking-wide uppercase font-tabular">
                      {it.occasion || 'Vacation'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleShare(it)}
                        className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-primary transition-colors"
                        title="Share Itinerary"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(it)}
                        className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItinerary(it.id, it.title)}
                        className="p-1.5 rounded-full hover:bg-error-container/20 text-outline hover:text-error transition-colors"
                        title="Delete Itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Destination & Title */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{it.destination_city}</span>
                      {it.country_code && <span className="text-outline">({it.country_code})</span>}
                    </div>
                    <h3 className="font-display font-bold text-xl text-on-surface group-hover:text-primary transition-colors">
                      {it.title}
                    </h3>
                    <p className="text-xs text-outline flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-tertiary" />
                      <span>{dateStr}</span>
                    </p>
                  </div>

                  {it.description && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {it.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-outline">
                      <span>Timeline Activities</span>
                      <span className="font-tabular">
                        {it.completed_count || 0} / {it.activity_count || 0} ({completionRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-optimal rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to={`/?city=${encodeURIComponent(it.destination_city)}`}
                    className="text-[11px] text-outline hover:text-primary font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Check Weather</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={ListTodo}
                    onClick={() => openTimeline(it)}
                  >
                    Manage Timeline
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT ITINERARY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-low border border-white/15 p-5 sm:p-8 space-y-5 shadow-glass text-on-surface">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-lg font-bold">
                {editingItinerary ? 'Edit Itinerary Details' : 'Create New Trip Itinerary'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItinerary} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Itinerary Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Baguio Mountain Holiday or Siargao Surf Trip"
                  required
                  className="w-full rounded-2xl bg-surface-container-high border border-white/10 px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <DestinationAutocomplete
                    label="Destination City"
                    value={formCity}
                    onChange={(cityName) => setFormCity(cityName)}
                    onSelectDestination={(dest) => {
                      setFormCity(dest.city);
                      if (!formTitle || formTitle.startsWith('Trip to ') || formTitle.includes('Holiday') || formTitle.includes('Escape')) {
                        setFormTitle(`Trip to ${dest.city}`);
                      }
                    }}
                    placeholder="Search Philippine destination (e.g. Baguio, Siargao, Boracay)..."
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Occasion</label>
                  <select
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                    className="w-full rounded-2xl bg-surface-container-high border border-white/10 px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    {occasions.filter((o) => o !== 'ALL').map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booking System-style Automated Date Range Picker */}
              <BookingDateRangePicker
                startDate={formStartDate}
                endDate={formEndDate}
                onStartDateChange={(startStr) => setFormStartDate(startStr)}
                onEndDateChange={(endStr) => setFormEndDate(endStr)}
                defaultDurationDays={2}
              />

              <div>
                <label className="font-semibold block mb-1">Description / Notes</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Trip objectives, gear requirements, companions..."
                  rows={3}
                  className="w-full rounded-2xl bg-surface-container-high border border-white/10 p-3 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-outline resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  {editingItinerary ? 'Save Changes' : 'Create Itinerary'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TIMELINE ACTIVITIES MODAL */}
      {selectedItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-surface-container-low border border-white/15 p-4 sm:p-8 flex flex-col justify-between shadow-glass text-on-surface overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase">
                    {selectedItinerary.occasion}
                  </span>
                  <span className="text-xs text-outline flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" /> {selectedItinerary.destination_city}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface mt-1">
                  {selectedItinerary.title} — Timeline
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItinerary(null)}
                className="p-1.5 rounded-full text-outline hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Timeline Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {isLoadingTimeline ? (
                <LoadingSkeleton variant="rectangle" count={3} />
              ) : timelineActivities.length === 0 ? (
                <div className="text-center py-8 text-outline text-xs space-y-2">
                  <Compass className="w-8 h-8 text-outline mx-auto" />
                  <p>No activities scheduled in this timeline yet.</p>
                  <p className="text-[11px]">
                    Add an activity below or save recommendations directly from the Weather Dashboard!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timelineActivities.map((act, index) => (
                    <div
                      key={act.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        act.is_completed
                          ? 'bg-surface-container/40 border-white/5 opacity-60'
                          : 'bg-surface-container-high/70 border-white/10 shadow-specular-inset'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleActivity(act)}
                          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            act.is_completed
                              ? 'bg-optimal border-optimal text-black font-bold'
                              : 'border-white/20 hover:border-primary'
                          }`}
                        >
                          {act.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-semibold text-sm ${
                                act.is_completed ? 'line-through text-outline' : 'text-on-surface'
                              }`}
                            >
                              {act.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline text-[10px] font-medium font-tabular">
                              {act.time_slot || 'Morning'}
                            </span>
                            <Badge
                              variant={
                                act.category === 'INDOOR'
                                  ? 'indoor'
                                  : act.suitability === 'OPTIMAL'
                                  ? 'optimal'
                                  : 'primary'
                              }
                              size="sm"
                            >
                              {act.category}
                            </Badge>
                          </div>

                          {act.notes && (
                            <p className="text-xs text-on-surface-variant font-medium">
                              {act.notes}
                            </p>
                          )}
                          {act.location_name && (
                            <p className="text-[11px] text-outline flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-tertiary" />
                              <span>{act.location_name}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="text-outline hover:text-error p-1 transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Activity Inline Form */}
              {isAddingActivity ? (
                <form onSubmit={handleAddActivity} className="p-4 rounded-2xl bg-surface-container-high border border-primary/30 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary uppercase text-[10px] tracking-wider">
                      Add New Activity
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingActivity(false)}
                      className="text-outline hover:text-on-surface"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-outline block mb-1">Activity Title *</label>
                    <input
                      type="text"
                      value={newActivityTitle}
                      onChange={(e) => setNewActivityTitle(e.target.value)}
                      placeholder="e.g. Sunrise Lake Cruise, Alpine Hiking Trail"
                      required
                      className="w-full rounded-xl bg-surface-container border border-white/10 px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <ActivityTimePicker
                      value={newActivityTimeSlot}
                      onChange={(val) => setNewActivityTimeSlot(val)}
                    />

                    <div>
                      <label className="text-[11px] text-outline block mb-1">Category</label>
                      <select
                        value={newActivityCategory}
                        onChange={(e) => setNewActivityCategory(e.target.value)}
                        className="w-full rounded-xl bg-surface-container border border-white/10 px-2.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                      >
                        <option value="OUTDOOR">OUTDOOR</option>
                        <option value="INDOOR">INDOOR</option>
                        <option value="CULTURAL">CULTURAL</option>
                        <option value="DINING">DINING</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-outline block mb-1">Notes / Instructions</label>
                    <input
                      type="text"
                      value={newActivityNotes}
                      onChange={(e) => setNewActivityNotes(e.target.value)}
                      placeholder="e.g. Ticket reservations, gear needed"
                      className="w-full rounded-xl bg-surface-container border border-white/10 px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingActivity(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" icon={Plus}>
                      Add to Timeline
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingActivity(true)}
                  className="w-full py-3 rounded-2xl border border-dashed border-white/20 hover:border-primary/50 text-outline hover:text-primary transition-all text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Activity to Timeline</span>
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs text-outline">
                {timelineActivities.filter((a) => a.is_completed).length} of {timelineActivities.length} items checked off
              </span>
              <Button variant="secondary" size="sm" onClick={() => setSelectedItinerary(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE ITINERARY MODAL */}
      {shareDialogData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-surface-container-low border border-white/15 p-6 sm:p-8 space-y-5 shadow-glass text-on-surface">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-display text-lg font-bold">Share Itinerary</h3>
              </div>
              <button
                type="button"
                onClick={() => setShareDialogData(null)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-outline">
                Anyone with this public link can view your curated itinerary, timeline schedule, and destination weather telemetry without logging in.
              </p>

              <div className="p-3 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-between gap-2 shadow-specular-inset">
                <span className="truncate font-mono text-[11px] text-on-surface select-all">
                  {shareDialogData.shareUrl}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(shareDialogData.shareUrl)}
                  className="px-3 py-1.5 rounded-xl bg-primary-container text-on-primary-container font-semibold text-xs flex items-center gap-1.5 shrink-0 hover:brightness-110 active:scale-95 transition-all"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={shareDialogData.shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Preview Public Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Button variant="outline" size="sm" onClick={() => setShareDialogData(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
