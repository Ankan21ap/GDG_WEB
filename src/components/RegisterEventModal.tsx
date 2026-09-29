import { useState, useId } from "react";
import confetti from "canvas-confetti";
import {
  X,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  Sparkles,
  Code2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Tag,
  FileText,
  RotateCcw
} from "lucide-react";
import {
  eventService,
  MongooseEventType,
  MongooseEventStatus,
  DEFAULT_EVENT_IMAGES,
} from "../services/eventService";
import { Event } from "../types";

interface RegisterEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: Event) => void;
}

export function RegisterEventModal({
  isOpen,
  onClose,
  onEventCreated,
}: RegisterEventModalProps) {
  const formId = useId();

  // Form states matching the exact Mongoose schema
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MongooseEventType>("AI");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("04:00 PM");
  const [venue, setVenue] = useState("Main Auditorium, FIEM Campus");
  const [address, setAddress] = useState(
    "Future Institute of Engineering and Management, Sonarpur Station Rd, Kolkata, WB 700150"
  );
  const [capacity, setCapacity] = useState<number>(150);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<MongooseEventStatus>("upcoming");
  const [registrationOpen, setRegistrationOpen] = useState(true);

  // UI tabs & states
  const [activeTab, setActiveTab] = useState<"form" | "schema" | "preview">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successEvent, setSuccessEvent] = useState<Event | null>(null);

  if (!isOpen) return null;

  // Handle title change and auto slug
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(eventService.generateSlug(newTitle));
    }
    if (formErrors.title) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.title;
        return next;
      });
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setAutoSlug(false);
    setSlug(newSlug.toLowerCase().replace(/\s+/g, "-"));
    if (formErrors.slug) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.slug;
        return next;
      });
    }
  };

  // Preset quick fill helper
  const handleFillSample = () => {
    const sampleTitle = "Next-Gen Gemini AI Sprint & Agent Hackathon";
    setTitle(sampleTitle);
    setSlug(eventService.generateSlug(sampleTitle));
    setAutoSlug(true);
    setDescription(
      "A fast-paced collaborative build sprint exploring the Gemini Multimodal APIs, Function Calling, and building agentic workflows on Google Cloud. Open to all FIEM undergraduate and graduate engineering students."
    );
    setType("Hackathon");
    setDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setStartTime("10:30 AM");
    setEndTime("05:00 PM");
    setVenue("CS Lab 402 & Innovation Hall, FIEM Campus");
    setCapacity(120);
    setImage(DEFAULT_EVENT_IMAGES.Hackathon);
    setStatus("upcoming");
    setRegistrationOpen(true);
    setFormErrors({});
    setSubmitError(null);
  };

  // Live document compiled for Mongoose
  const liveMongooseDoc = {
    title: title || "(Untitled Event)",
    slug: slug || "(auto-generated-slug)",
    description: description || "(Event description)",
    type,
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    startTime,
    endTime,
    venue,
    address,
    capacity: Number(capacity) || 0,
    registrationCount: 0,
    image: image || DEFAULT_EVENT_IMAGES[type],
    status,
    registrationOpen,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setFormErrors({});

    const result = await eventService.registerNewEvent({
      title,
      slug,
      description,
      type,
      date,
      startTime,
      endTime,
      venue,
      address,
      capacity: Number(capacity),
      registrationCount: 0,
      image: image || DEFAULT_EVENT_IMAGES[type],
      status,
      registrationOpen,
    });

    setIsSubmitting(false);

    if (result.success && result.event) {
      setSuccessEvent(result.event);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti optional
      }
      if (onEventCreated) {
        onEventCreated(result.event);
      }
    } else {
      setSubmitError(result.error || "Failed to register event.");
      if (result.validationErrors) {
        setFormErrors(result.validationErrors);
      }
    }
  };

  const handleResetForm = () => {
    setSuccessEvent(null);
    setTitle("");
    setSlug("");
    setAutoSlug(true);
    setDescription("");
    setType("AI");
    setDate("");
    setCapacity(150);
    setImage("");
    setFormErrors({});
    setSubmitError(null);
  };

  const typeOptions: MongooseEventType[] = [
    "AI",
    "Web",
    "Cloud",
    "Android",
    "Career",
    "Hackathon",
    "Workshop",
    "Meetup",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="register-event-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-white border border-[#DADCE0] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#DADCE0] flex items-center justify-between gap-4 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#137333] border border-emerald-200">
                <Sparkles className="w-3 h-3 text-[#34A853]" />
                <span>Mongoose Event Schema</span>
              </span>
              <span className="text-xs text-neutral-300 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-[#5F6368] hidden sm:inline">
                models/event.js
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] tracking-tight flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#34A853]" />
              <span>Register New Event</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#3C4043] hover:text-[#202124] bg-neutral-100 hover:bg-neutral-200 border border-[#DADCE0] transition-colors hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
              title="Autofill a sample event for quick testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
              <span>Fill Sample</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              id="close-register-event-btn"
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#5F6368] hover:text-[#202124] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Form vs Mongoose Schema View) */}
        <div className="px-4 sm:px-6 pt-3 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`pb-2.5 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "form"
                ? "text-[#1A73E8] border-[#1A73E8]"
                : "text-[#5F6368] border-transparent hover:text-[#202124]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Event Registration Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`pb-2.5 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "schema"
                ? "text-[#1A73E8] border-[#1A73E8]"
                : "text-[#5F6368] border-transparent hover:text-[#202124]"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Mongoose Schema & JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`pb-2.5 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preview"
                ? "text-[#1A73E8] border-[#1A73E8]"
                : "text-[#5F6368] border-transparent hover:text-[#202124]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Live Card Preview</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* Success Screen */}
          {successEvent ? (
            <div className="text-center py-8 px-4 space-y-5 bg-emerald-50/40 border border-emerald-200 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#137333] border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-[#34A853]" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#202124] tracking-tight">
                  Event Registered Successfully!
                </h3>
                <p className="text-sm text-[#5F6368]">
                  <span className="font-semibold text-[#137333]">"{successEvent.title}"</span> has been saved and published. It is now active in the Upcoming Events schedule and available for student RSVPs.
                </p>
              </div>

              {/* Event Quick Summary Card */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-white border border-[#DADCE0] text-left space-y-2 text-xs shadow-xs">
                <div className="flex items-center justify-between text-[#5F6368]">
                  <span className="font-mono text-[#80868B]">Slug:</span>
                  <span className="font-mono text-[#137333] font-medium">/events/{successEvent.slug}</span>
                </div>
                <div className="flex items-center justify-between text-[#5F6368]">
                  <span className="font-mono text-[#80868B]">Track / Type:</span>
                  <span className="font-semibold text-[#202124]">{successEvent.type}</span>
                </div>
                <div className="flex items-center justify-between text-[#5F6368]">
                  <span className="font-mono text-[#80868B]">Scheduled Date:</span>
                  <span className="font-semibold text-[#202124]">{successEvent.displayDate} ({successEvent.startTime})</span>
                </div>
                <div className="flex items-center justify-between text-[#5F6368]">
                  <span className="font-mono text-[#80868B]">Venue & Seats:</span>
                  <span className="font-semibold text-[#202124]">{successEvent.venue} • {successEvent.capacity} seats</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  View In Upcoming Events
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#3C4043] hover:text-[#202124] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Register Another Event</span>
                </button>
              </div>
            </div>
          ) : activeTab === "form" ? (
            /* TAB 1: FORM */
            <form id={`${formId}-form`} onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 space-y-1.5">
                  <label
                    htmlFor={`${formId}-title`}
                    className="block text-xs font-semibold text-[#202124]"
                  >
                    Event Title <span className="text-[#EA4335]">*</span>
                  </label>
                  <input
                    id={`${formId}-title`}
                    type="text"
                    required
                    placeholder="e.g. AI Build Day 2026 or Cloud Study Jam"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                      formErrors.title
                        ? "border-red-500 focus:border-red-400"
                        : "border-[#DADCE0] focus:border-[#1A73E8]"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-[#EA4335]">{formErrors.title}</p>
                  )}
                </div>

                <div className="sm:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`${formId}-slug`}
                      className="block text-xs font-semibold text-[#202124]"
                    >
                      URL Slug <span className="text-[#EA4335]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        setSlug(eventService.generateSlug(title));
                      }}
                      className="text-[10px] text-[#1A73E8] hover:underline cursor-pointer font-medium"
                    >
                      Auto from title
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#80868B] font-mono">
                      /
                    </span>
                    <input
                      id={`${formId}-slug`}
                      type="text"
                      required
                      placeholder="ai-build-day-2026"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className={`w-full pl-6 pr-3.5 py-2.5 bg-white rounded-xl border text-xs font-mono text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                        formErrors.slug
                          ? "border-red-500 focus:border-red-400"
                          : "border-[#DADCE0] focus:border-[#1A73E8]"
                      }`}
                    />
                  </div>
                  {formErrors.slug && (
                    <p className="text-[11px] text-[#EA4335]">{formErrors.slug}</p>
                  )}
                </div>
              </div>

              {/* Type, Date, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-type`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>Type / Track</span> <span className="text-[#EA4335]">*</span>
                  </label>
                  <select
                    id={`${formId}-type`}
                    value={type}
                    onChange={(e) => {
                      const newType = e.target.value as MongooseEventType;
                      setType(newType);
                      if (!image) {
                        setImage(DEFAULT_EVENT_IMAGES[newType]);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-date`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <span>Event Date</span> <span className="text-[#EA4335]">*</span>
                  </label>
                  <input
                    id={`${formId}-date`}
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-3 py-2.5 bg-white rounded-xl border text-sm text-[#202124] focus:outline-none transition-colors ${
                      formErrors.date
                        ? "border-red-500 focus:border-red-400"
                        : "border-[#DADCE0] focus:border-[#1A73E8]"
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-[11px] text-[#EA4335]">{formErrors.date}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-status`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>Status</span>
                  </label>
                  <select
                    id={`${formId}-status`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MongooseEventStatus)}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live (Happening Today)</option>
                    <option value="past">Past (Concluded)</option>
                  </select>
                </div>
              </div>

              {/* Times & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-startTime`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>Start Time</span>
                  </label>
                  <input
                    id={`${formId}-startTime`}
                    type="text"
                    placeholder="10:00 AM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#DADCE0] text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-endTime`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <span>End Time</span>
                  </label>
                  <input
                    id={`${formId}-endTime`}
                    type="text"
                    placeholder="04:00 PM"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#DADCE0] text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-capacity`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>Capacity (Seats)</span> <span className="text-[#EA4335]">*</span>
                  </label>
                  <input
                    id={`${formId}-capacity`}
                    type="number"
                    min="1"
                    max="2000"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 bg-white rounded-xl border text-sm text-[#202124] focus:outline-none transition-colors ${
                      formErrors.capacity
                        ? "border-red-500 focus:border-red-400"
                        : "border-[#DADCE0] focus:border-[#1A73E8]"
                    }`}
                  />
                  {formErrors.capacity && (
                    <p className="text-[11px] text-[#EA4335]">{formErrors.capacity}</p>
                  )}
                </div>
              </div>

              {/* Venue & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-venue`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                    <span>Venue Name</span> <span className="text-[#EA4335]">*</span>
                  </label>
                  <input
                    id={`${formId}-venue`}
                    type="text"
                    required
                    placeholder="Main Auditorium, FIEM Campus"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors ${
                      formErrors.venue
                        ? "border-red-500 focus:border-red-400"
                        : "border-[#DADCE0] focus:border-[#1A73E8]"
                    }`}
                  />
                  {formErrors.venue && (
                    <p className="text-[11px] text-[#EA4335]">{formErrors.venue}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`${formId}-address`}
                    className="block text-xs font-semibold text-[#202124]"
                  >
                    Full Physical Address
                  </label>
                  <input
                    id={`${formId}-address`}
                    type="text"
                    placeholder="Future Institute of Eng & Mgmt, Sonarpur, Kolkata 700150"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#DADCE0] text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              {/* Image URL & Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${formId}-image`}
                    className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>Banner Image URL</span>
                  </label>
                  <span className="text-[11px] text-[#5F6368]">Preset or custom Unsplash URL</span>
                </div>
                <input
                  id={`${formId}-image`}
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#DADCE0] text-xs font-mono text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8]"
                />

                {/* Quick preset thumbnail chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] text-[#5F6368] shrink-0 font-mono">Use Preset:</span>
                  {(["AI", "Web", "Cloud", "Android", "Hackathon", "Workshop"] as MongooseEventType[]).map(
                    (pType) => (
                      <button
                        key={pType}
                        type="button"
                        onClick={() => setImage(DEFAULT_EVENT_IMAGES[pType])}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-[#3C4043] hover:text-[#202124] border border-[#DADCE0] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {pType} Photo
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label
                  htmlFor={`${formId}-description`}
                  className="block text-xs font-semibold text-[#202124] flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#34A853]" />
                  <span>Description</span> <span className="text-[#EA4335]">*</span>
                </label>
                <textarea
                  id={`${formId}-description`}
                  rows={4}
                  required
                  placeholder="Write a clear summary of what attendees will learn, prerequisites, workshops or projects being built..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#202124] placeholder-[#80868B] focus:outline-none transition-colors leading-relaxed ${
                    formErrors.description
                      ? "border-red-500 focus:border-red-400"
                      : "border-[#DADCE0] focus:border-[#1A73E8]"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-[11px] text-[#EA4335]">{formErrors.description}</p>
                )}
              </div>

              {/* Registration Open Toggle */}
              <div className="p-3.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#202124] block">
                    Accept Public Student Registrations
                  </span>
                  <span className="text-[11px] text-[#5F6368] block">
                    When enabled, attendees can RSVP and receive digital QR entry passes immediately.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationOpen}
                    onChange={(e) => setRegistrationOpen(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A73E8]" />
                </label>
              </div>

              {/* Form Submit Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-[#DADCE0]">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#5F6368] hover:text-[#202124] transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-register-event-btn"
                  className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1A73E8] hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish & Register Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : activeTab === "schema" ? (
            /* TAB 2: MONGOOSE SCHEMA & LIVE JSON CODE */
            <div className="space-y-6">
              {/* Mongoose Schema definition display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#34A853]" />
                    <span className="text-xs font-semibold text-[#202124]">
                      Mongoose Schema Definition (server/models/event.js)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5F6368] bg-neutral-100 border border-[#DADCE0] px-2 py-0.5 rounded">
                    Mongoose v9.10
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] font-mono text-[11px] text-[#202124] overflow-x-auto leading-relaxed max-h-72">
                  <pre className="text-[#137333] font-semibold mb-1">
                    {'import mongoose from "mongoose";'}
                  </pre>
                  <pre className="text-[#3C4043]">{`
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["AI", "Web", "Cloud", "Android", "Career", "Hackathon", "Workshop", "Meetup"],
      required: true,
    },
    date: { type: Date, required: true },
    startTime: String,
    endTime: String,
    venue: { type: String, required: true },
    address: String,
    capacity: { type: Number, required: true, min: 1 },
    registrationCount: { type: Number, default: 0 },
    image: String,
    status: {
      type: String,
      enum: ["upcoming", "live", "past"],
      default: "upcoming",
    },
    registrationOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;`}</pre>
                </div>
              </div>

              {/* Live JSON Document Prepared for MongoDB */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1A73E8]" />
                    <span className="text-xs font-semibold text-[#202124]">
                      Live Document Being Prepared for MongoDB Insertion
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#137333] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Live Reactive Document
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] font-mono text-[11px] text-[#1A73E8] overflow-x-auto leading-relaxed">
                  <pre>{JSON.stringify(liveMongooseDoc, null, 2)}</pre>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Return to Form
                </button>
              </div>
            </div>
          ) : (
            /* TAB 3: LIVE CARD PREVIEW */
            <div className="space-y-4">
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#DADCE0] text-xs text-[#5F6368] flex items-center justify-between">
                <span>Preview of how this event appears in the Upcoming Events schedule:</span>
                <span className="text-[#34A853] font-semibold font-mono">Live Render</span>
              </div>

              <div className="max-w-md mx-auto bg-white border border-[#DADCE0] rounded-2xl overflow-hidden shadow-md">
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={image || DEFAULT_EVENT_IMAGES[type]}
                    alt={title || "Preview"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#1A73E8] border border-[#DADCE0] backdrop-blur-md shadow-xs">
                      {type} • {status}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#137333] border border-emerald-200 backdrop-blur-md shadow-xs">
                      {registrationOpen ? "RSVP Open" : "RSVP Closed"}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-black/70 text-white border border-white/20 backdrop-blur-md">
                      {capacity} seats
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <Calendar className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>
                      {date
                        ? new Date(date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Select a date"}
                    </span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <span>{startTime} - {endTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202124] tracking-tight">
                    {title || "Your Event Headline"}
                  </h3>

                  <p className="text-xs text-[#5F6368] line-clamp-2 leading-relaxed">
                    {description || "Event summary and learning outcomes will be displayed here..."}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#5F6368] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#EA4335] shrink-0" />
                    <span className="truncate">{venue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Return to Edit Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
