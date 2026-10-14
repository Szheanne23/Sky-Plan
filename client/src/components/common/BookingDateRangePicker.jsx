import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { format, parseISO, addDays, differenceInCalendarDays, isValid } from 'date-fns';
import { Calendar, Clock, Sparkles, ArrowRight, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Custom Input Button for DatePicker matching Google Stitch design
 */
const CustomDateInput = forwardRef(({ value, onClick, onClear, placeholder, label, isEnd = false }, ref) => (
  <div className="relative w-full">
    <div
      onClick={onClick}
      ref={ref}
      className="w-full flex items-center justify-between rounded-2xl bg-surface-container-high border border-white/10 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 px-3.5 py-2.5 text-xs text-on-surface cursor-pointer shadow-specular-inset transition-all group"
    >
      <div className="flex items-center gap-2.5 truncate">
        <Calendar className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
        <span className={value ? 'font-medium text-on-surface' : 'text-outline'}>
          {value || placeholder}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {value && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  </div>
));

CustomDateInput.displayName = 'CustomDateInput';

/**
 * BookingDateRangePicker
 *
 * Emulates modern booking systems (Airbnb, Booking.com):
 * - Selecting Start Date automatically proposes/updates End Date
 * - Enforces End Date >= Start Date
 * - Displays computed Trip Duration badge (e.g. "3 Days / 2 Nights")
 * - Offers quick duration presets (+1 Day, +2 Days, +3 Days, +5 Days, +7 Days)
 */
export default function BookingDateRangePicker({
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  defaultDurationDays = 2, // default 3 days / 2 nights
  className = '',
}) {
  // Parse incoming YYYY-MM-DD strings to Date objects safely
  const parseSafeDate = (dStr) => {
    if (!dStr) return null;
    try {
      const parsed = typeof dStr === 'string' ? parseISO(dStr) : dStr;
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const start = parseSafeDate(startDate);
  const end = parseSafeDate(endDate);

  // Compute duration
  let durationText = null;
  let nightCount = 0;
  let dayCount = 0;

  if (start && end) {
    nightCount = differenceInCalendarDays(end, start);
    dayCount = nightCount + 1;
    if (nightCount === 0) {
      durationText = 'Same-Day Excursion (1 Day)';
    } else if (nightCount === 1) {
      durationText = '2 Days / 1 Night (Overnight)';
    } else {
      durationText = `${dayCount} Days / ${nightCount} Nights`;
    }
  } else if (start && !end) {
    durationText = 'Pick return date';
  }

  // Handle Start Date selection (Automate End Date like booking engines)
  const handleStartSelect = (date) => {
    if (!date || !isValid(date)) {
      if (onStartDateChange) onStartDateChange('');
      return;
    }

    const formattedStart = format(date, 'yyyy-MM-dd');
    if (onStartDateChange) onStartDateChange(formattedStart, date);

    // If no end date or end date is on or before new start date, automate end date
    if (!end || end <= date) {
      const autoEnd = addDays(date, defaultDurationDays);
      const formattedEnd = format(autoEnd, 'yyyy-MM-dd');
      if (onEndDateChange) onEndDateChange(formattedEnd, autoEnd);
    }
  };

  // Handle End Date selection
  const handleEndSelect = (date) => {
    if (!date || !isValid(date)) {
      if (onEndDateChange) onEndDateChange('');
      return;
    }

    const formattedEnd = format(date, 'yyyy-MM-dd');
    if (onEndDateChange) onEndDateChange(formattedEnd, date);
  };

  // Preset buttons: adjust duration relative to start date
  const applyPreset = (additionalDays) => {
    const baseStart = start || new Date();
    if (!start) {
      const formattedStart = format(baseStart, 'yyyy-MM-dd');
      if (onStartDateChange) onStartDateChange(formattedStart, baseStart);
    }
    const targetEnd = addDays(baseStart, additionalDays);
    const formattedEnd = format(targetEnd, 'yyyy-MM-dd');
    if (onEndDateChange) onEndDateChange(formattedEnd, targetEnd);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Date Pickers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Start Date */}
        <div>
          <label className="font-semibold block mb-1 text-xs text-on-surface flex items-center justify-between">
            <span>Departure / Start Date</span>
            <span className="text-[10px] text-primary font-normal">Check-in</span>
          </label>
          <DatePicker
            selected={start}
            onChange={handleStartSelect}
            selectsStart
            startDate={start}
            endDate={end}
            minDate={new Date()}
            dateFormat="EEE, MMM d, yyyy"
            customInput={
              <CustomDateInput
                placeholder="Select start date"
                onClear={() => onStartDateChange && onStartDateChange('')}
              />
            }
            popperClassName="stitch-datepicker-popper"
          />
        </div>

        {/* End Date (Auto-linked) */}
        <div>
          <label className="font-semibold block mb-1 text-xs text-on-surface flex items-center justify-between">
            <span>Return / End Date</span>
            <span className="text-[10px] text-optimal font-normal">Check-out (Auto)</span>
          </label>
          <DatePicker
            selected={end}
            onChange={handleEndSelect}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start ? addDays(start, 1) : new Date()}
            dateFormat="EEE, MMM d, yyyy"
            customInput={
              <CustomDateInput
                placeholder="Select return date"
                isEnd
                onClear={() => onEndDateChange && onEndDateChange('')}
              />
            }
            popperClassName="stitch-datepicker-popper"
          />
        </div>
      </div>

      {/* Booking Status Capsule & Quick Duration Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
        {/* Trip Duration Pill */}
        {durationText ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trip Duration: {durationText}</span>
          </div>
        ) : (
          <span className="text-outline text-[11px]">
            Selecting start date automatically suggests trip length.
          </span>
        )}

        {/* Quick Duration Presets (Booking System Style) */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-outline text-[10px] font-medium mr-1 uppercase">Quick:</span>
          <button
            type="button"
            onClick={() => applyPreset(1)}
            className="px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[10px] font-medium transition-all"
            title="Overnight getaway (1 night)"
          >
            +1 Day
          </button>
          <button
            type="button"
            onClick={() => applyPreset(2)}
            className="px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[10px] font-medium transition-all"
            title="Weekend trip (2 nights)"
          >
            +2 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset(3)}
            className="px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[10px] font-medium transition-all"
            title="Long weekend (3 nights)"
          >
            +3 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset(5)}
            className="px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[10px] font-medium transition-all"
            title="Holiday vacation (5 nights)"
          >
            +5 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset(7)}
            className="px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[10px] font-medium transition-all"
            title="Full week getaway (7 nights)"
          >
            +1 Week
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ActivityTimePicker
 * Modern time and date picker component for scheduling specific activities inside an itinerary timeline.
 */
export function ActivityTimePicker({
  value = 'Morning (09:00 - 12:00)',
  onChange,
  className = '',
}) {
  const [selectedTime, setSelectedTime] = useState(new Date());

  const quickSlots = [
    'Morning (09:00 - 12:00)',
    'Midday / Lunch (12:00 - 14:00)',
    'Afternoon (14:00 - 18:00)',
    'Sunset & Evening (18:00 - 21:00)',
    'Night (21:00+)',
    'Full Day Excursion',
  ];

  const handleCustomTime = (date) => {
    if (!date) return;
    setSelectedTime(date);
    const timeFormatted = format(date, 'hh:mm a');
    if (onChange) onChange(timeFormatted);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[11px] text-outline block mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-tertiary" /> Time Window / Schedule
        </span>
        <span className="text-[10px] text-primary">Custom or Preset</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Preset Selector */}
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full rounded-xl bg-surface-container border border-white/10 px-2.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
        >
          {quickSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
          {!quickSlots.includes(value) && (
            <option value={value}>Exact Time: {value}</option>
          )}
        </select>

        {/* Exact Time Picker using react-datepicker */}
        <div className="relative">
          <DatePicker
            selected={selectedTime}
            onChange={handleCustomTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="h:mm aa"
            customInput={
              <button
                type="button"
                className="w-full rounded-xl bg-surface-container border border-white/10 hover:border-primary/40 px-3 py-2 text-xs text-on-surface flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-1.5 text-outline hover:text-on-surface">
                  <Clock className="w-3.5 h-3.5 text-tertiary" />
                  <span>Pick Exact Time</span>
                </span>
                <span className="text-primary font-semibold font-tabular">
                  {format(selectedTime, 'hh:mm a')}
                </span>
              </button>
            }
            popperClassName="stitch-datepicker-popper"
          />
        </div>
      </div>
    </div>
  );
}
