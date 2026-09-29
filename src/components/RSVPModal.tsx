import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X, AlertCircle, Loader2, CheckCircle2, Calendar, MapPin, Building, User, Mail, Phone, BookOpen, Ticket, Search } from "lucide-react";
import { Event, Registration } from "../types";
import { registrationService, RegisterResult } from "../services/registrationService";
import { QRPass } from "./QRPass";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingEvents: Event[];
  initialEventId?: string;
}

export function RSVPModal({
  isOpen,
  onClose,
  upcomingEvents,
  initialEventId,
}: RSVPModalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("Future Institute of Engineering and Management (FIEM)");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<Registration | null>(null);
  const [duplicateRegistration, setDuplicateRegistration] = useState<Registration | null>(null);
  const [isLookupMode, setIsLookupMode] = useState(false);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Sync event selection on open
  useEffect(() => {
    if (isOpen) {
      if (initialEventId && upcomingEvents.some((e) => e.id === initialEventId)) {
        setSelectedEventId(initialEventId);
      } else if (upcomingEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(upcomingEvents[0].id);
      }
      // Reset errors & states when modal opens
      setErrors({});
      setServerError(null);
      setSuccessRegistration(null);
      setDuplicateRegistration(null);
      setIsLookupMode(false);
      setLookupQuery("");
      setLookupError(null);
    }
  }, [isOpen, initialEventId, upcomingEvents]);

  if (!isOpen) return null;

  const currentSelectedEvent = upcomingEvents.find((e) => e.id === selectedEventId) || upcomingEvents[0];

  // Validation logic
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!selectedEventId) {
      errs.event = "Please select an event to register for.";
    }

    if (!name.trim()) {
      errs.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else {
      const cleanPhone = phone.replace(/[\s-]/g, "");
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        errs.phone = "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (/^[6-9]\\d{9}$/).";
      }
    }

    if (!college.trim()) {
      errs.college = "College / Organization is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setDuplicateRegistration(null);

    if (!validateForm() || !currentSelectedEvent) {
      return;
    }

    setIsLoading(true);

    try {
      const result: RegisterResult = await registrationService.register({
        eventId: currentSelectedEvent.id,
        eventTitle: currentSelectedEvent.title,
        eventDate: currentSelectedEvent.displayDate,
        eventTime: `${currentSelectedEvent.startTime} - ${currentSelectedEvent.endTime}`,
        eventVenue: currentSelectedEvent.venue,
        name,
        email,
        phone,
        college,
        department,
        year,
        experienceLevel,
      });

      if (result.success && result.registration) {
        setSuccessRegistration(result.registration);
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#4285F4", "#EA4335", "#FBBC04", "#34A853"],
          });
        } catch {
          // Ignore confetti errors
        }
      } else if (result.isDuplicate && result.registration) {
        setDuplicateRegistration(result.registration);
      } else {
        setServerError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("An unexpected network error occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookupPass = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      setLookupError("Please enter your registered email address or ticket ID.");
      return;
    }

    const all = registrationService.getRegistrations();
    const match = all.find(
      (r) =>
        r.email.toLowerCase() === q ||
        r.id.toLowerCase() === q ||
        (r.registrationId && r.registrationId.toLowerCase() === q)
    );

    if (match) {
      setSuccessRegistration(match);
    } else {
      setLookupError(
        `No confirmed registration found for "${lookupQuery}". Please double check your email or ticket ID (e.g. GDG-FIEM-A91XK).`
      );
    }
  };

  return (
    <div
      id="rsvp-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="rsvp-modal-content"
        className="relative w-full max-w-2xl bg-white border border-[#DADCE0] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-[#202124]"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-[#202124] tracking-tight">
              {successRegistration
                ? "Registration Confirmed"
                : isLookupMode
                ? "Find My RSVP Pass"
                : "Event RSVP & Pass Registration"}
            </h2>
          </div>

          <button
            type="button"
            id="close-rsvp-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs (when not already showing pass) */}
        {!successRegistration && (
          <div className="flex border-b border-neutral-200 bg-neutral-50/70 px-6 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLookupMode(false);
                setLookupError(null);
              }}
              className={`pb-2.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                !isLookupMode
                  ? "border-[#1A73E8] text-[#1A73E8] font-bold"
                  : "border-transparent text-[#5F6368] hover:text-[#202124]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>New Registration</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLookupMode(true);
                setServerError(null);
                setDuplicateRegistration(null);
              }}
              className={`pb-2.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                isLookupMode
                  ? "border-[#1A73E8] text-[#1A73E8] font-bold"
                  : "border-transparent text-[#5F6368] hover:text-[#202124]"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Find My Pass</span>
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Success State */}
          {successRegistration ? (
            <QRPass registration={successRegistration} onClose={onClose} />
          ) : isLookupMode ? (
            /* Lookup Pass Mode */
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1A73E8] border border-blue-200 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#202124]">Retrieve Your Registered Pass</h3>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Already submitted an RSVP? Enter your email address or Ticket ID to instantly display and print your digital entry pass.
                </p>
              </div>

              <form onSubmit={handleLookupPass} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-1.5">
                  <label htmlFor="lookup-query" className="text-xs font-semibold text-[#202124]">
                    Registered Email or Ticket ID *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5" />
                    <input
                      id="lookup-query"
                      type="text"
                      placeholder="e.g. ananya.sen@fiem.edu.in or GDG-FIEM-A91XK"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DADCE0] rounded-xl text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8] transition-colors"
                    />
                  </div>
                </div>

                {lookupError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{lookupError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Find My Pass</span>
                </button>
              </form>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-[#5F6368] text-center max-w-md mx-auto">
                Haven't registered yet?{" "}
                <button
                  type="button"
                  onClick={() => setIsLookupMode(false)}
                  className="text-[#1A73E8] hover:underline font-semibold cursor-pointer ml-1"
                >
                  RSVP for an upcoming event now
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Duplicate Warning */}
              {duplicateRegistration && (
                <div
                  id="duplicate-registration-banner"
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 text-sm space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Already Registered!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5F6368]">
                    This email (<span className="text-[#202124] font-mono font-semibold">{email}</span>) has already been registered for{" "}
                    <span className="font-semibold text-[#202124]">{currentSelectedEvent?.title}</span> with Ticket ID{" "}
                    <span className="font-mono font-bold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{duplicateRegistration.id}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccessRegistration(duplicateRegistration)}
                    className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>View Your Existing Pass</span>
                  </button>
                </div>
              )}

              {/* Server Error Warning */}
              {serverError && (
                <div
                  id="server-error-banner"
                  className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-sm flex items-start gap-3 animate-in fade-in"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">Registration Failed</p>
                    <p className="text-xs text-red-700 mt-0.5">{serverError}</p>
                  </div>
                </div>
              )}

              {/* Event Selection & Context Pill */}
              <div className="space-y-2">
                <label htmlFor="event-select" className="text-xs font-semibold text-[#202124] uppercase tracking-wider block">
                  Select Upcoming Event *
                </label>
                <div className="relative">
                  <select
                    id="event-select"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-3 text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8] transition-colors appearance-none cursor-pointer"
                  >
                    {upcomingEvents.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title} — {evt.displayDate} ({evt.seatsRemaining || 0} seats left)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#80868B]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                {errors.event && (
                  <p className="text-xs text-red-600 font-medium">{errors.event}</p>
                )}
              </div>

              {/* Event Summary Snapshot Card */}
              {currentSelectedEvent && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-[#5F6368] grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                    <div>
                      <span className="text-[#80868B] block text-[10px]">Date & Time</span>
                      <span className="font-semibold text-[#202124] truncate block">
                        {currentSelectedEvent.displayDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[#80868B] block text-[10px]">Venue</span>
                      <span className="font-semibold text-[#202124] truncate block">
                        {currentSelectedEvent.venue}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Details */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-name" className="text-xs font-semibold text-[#202124] block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="e.g. Subhadip Roy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                        errors.name ? "border-red-500 focus:border-red-500" : "border-[#DADCE0] focus:border-[#1A73E8]"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 font-medium mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-email" className="text-xs font-semibold text-[#202124] block mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="developer@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                          errors.email ? "border-red-500 focus:border-red-500" : "border-[#DADCE0] focus:border-[#1A73E8]"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-phone" className="text-xs font-semibold text-[#202124] block mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                          errors.phone ? "border-red-500 focus:border-red-500" : "border-[#DADCE0] focus:border-[#1A73E8]"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* College / Organization */}
                <div>
                  <label htmlFor="reg-college" className="text-xs font-semibold text-[#202124] block mb-1.5">
                    College / Organization *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
                    <input
                      id="reg-college"
                      type="text"
                      placeholder="e.g. Future Institute of Engineering and Management"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                        errors.college ? "border-red-500 focus:border-red-500" : "border-[#DADCE0] focus:border-[#1A73E8]"
                      }`}
                    />
                  </div>
                  {errors.college && (
                    <p className="text-xs text-red-600 font-medium mt-1">{errors.college}</p>
                  )}
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-department" className="text-xs font-semibold text-[#5F6368] block mb-1.5">
                      Department / Stream
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
                      <input
                        id="reg-department"
                        type="text"
                        placeholder="e.g. CSE / IT / ECE"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-white border border-[#DADCE0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-year" className="text-xs font-semibold text-[#5F6368] block mb-1.5">
                      Year of Study
                    </label>
                    <select
                      id="reg-year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-2.5 text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Alumni / Professional">Alumni / Professional</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="submit"
                    id="submit-rsvp-btn"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isLoading
                        ? "bg-blue-800 cursor-not-allowed opacity-80"
                        : "bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Validating &amp; Generating Pass...</span>
                      </>
                    ) : (
                      <span>Confirm RSVP &amp; Generate Pass</span>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#5F6368] mt-2.5">
                    Admission is free. An official verifiable ticket ID &amp; QR pass will be generated upon confirmation.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
