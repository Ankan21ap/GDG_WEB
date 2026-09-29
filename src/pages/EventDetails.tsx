import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Laptop, 
  Award, 
  Lightbulb, 
  HelpCircle,
  Share2,
  ChevronDown
} from "lucide-react";
import { getEventBySlug } from "../data/events";
import { eventService } from "../services/eventService";
import { SpeakerCard } from "../components/SpeakerCard";
import { AgendaTimeline } from "../components/AgendaTimeline";
import { VenueMap } from "../components/VenueMap";
import { PersonalizedPlan } from "../components/PersonalizedPlan";
import { Countdown } from "../components/Countdown";
import { GoogleDots } from "../components/GoogleColorsBar";
import { RSVPCandidatesModal } from "../components/RSVPCandidatesModal";
import { registrationService } from "../services/registrationService";
import { useState, useEffect } from "react";
import { Event } from "../types";

interface EventDetailsProps {
  onOpenRSVP: (eventId: string) => void;
}

export function EventDetails({ onOpenRSVP }: EventDetailsProps) {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false);
  const [eventCandidatesCount, setEventCandidatesCount] = useState<number>(0);

  useEffect(() => {
    if (!slug) {
      setEvent(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    eventService.getEventBySlug(slug)
      .then((evt) => {
        if (evt) {
          setEvent(evt);
        } else {
          const fallback = getEventBySlug(slug);
          setEvent(fallback || null);
        }
      })
      .catch(() => {
        const fallback = getEventBySlug(slug);
        setEvent(fallback || null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  // Load RSVP candidate count for this event
  useEffect(() => {
    if (event) {
      registrationService.fetchRegistrationsFromDb().then((all) => {
        const forThis = all.filter((r) => r.eventId === event.id || r.eventTitle === event.title);
        setEventCandidatesCount(forThis.length);
      });
    }
  }, [event]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 bg-[#F8F9FA] text-[#202124]">
        <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5F6368] font-mono">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 bg-[#F8F9FA] text-[#202124]">
        <h2 className="text-2xl font-bold text-[#202124]">Event Not Found</h2>
        <p className="text-xs text-[#5F6368]">The requested event could not be found or has been moved.</p>
        <Link
          to="/upcoming-events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upcoming Events</span>
        </Link>
      </div>
    );
  }

  const isUpcoming = event.status === "upcoming";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${event.title} - GDG on Campus FIEM`,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const experienceCards = [
    { title: "Hands-on Learning", desc: "Write actual code with step-by-step guidance from senior engineers.", icon: Laptop, color: "text-[#1A73E8]" },
    { title: "High-Caliber Networking", desc: "Connect with tech mentors, recruiters, and passionate student builders.", icon: Users, color: "text-amber-600" },
    { title: "Live Demonstrations", desc: "Watch real-time system architectures and AI model deployments in action.", icon: Lightbulb, color: "text-[#1E8E3E]" },
    { title: "Digital Credentials", desc: "Receive an official verifiable GDG on Campus participation certificate.", icon: Award, color: "text-purple-600" },
  ];

  return (
    <div id="event-details-container" className="space-y-16 pb-16 bg-[#F8F9FA] text-[#202124]">
      {/* 1. EVENT HERO BANNER */}
      <section id="event-hero-banner" className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to={isUpcoming ? "/upcoming-events" : "/past-events"}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {isUpcoming ? "Upcoming Events" : "Past Events"}</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3C4043] bg-white border border-[#DADCE0] hover:text-[#202124] hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>{copiedLink ? "Link Copied!" : "Share Event"}</span>
            </button>
          </div>

          {/* Hero Card Container */}
          <div className="relative rounded-3xl overflow-hidden border border-[#DADCE0] bg-white shadow-md">
            {/* Background Cover Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-neutral-100">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#202124] border border-neutral-200 backdrop-blur-md shadow-xs">
                  {event.category} • {event.type}
                </span>

                {isUpcoming ? (
                  event.registrationOpen ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Registration Open</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 backdrop-blur-md shadow-xs">
                      Seats Full
                    </span>
                  )
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-[#3C4043] border border-neutral-200 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Concluded Event</span>
                  </span>
                )}
              </div>
            </div>

            {/* Hero Details Content */}
            <div className="p-6 sm:p-10 relative z-10 space-y-6 bg-white">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-[#5F6368] uppercase tracking-wider">
                    GDG on Campus FIEM
                  </span>
                  <GoogleDots />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight leading-tight">
                  {event.title}
                </h1>
                <p className="text-base sm:text-lg text-[#5F6368] max-w-3xl leading-relaxed">
                  {event.shortDescription}
                </p>
              </div>

              {/* Metadata strip: Date, Time, Venue, Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <Calendar className="w-5 h-5 text-[#1A73E8] shrink-0" />
                  <div>
                    <span className="text-[#80868B] block text-[10px] uppercase font-mono">Date</span>
                    <span className="font-semibold text-[#202124]">{event.displayDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[#80868B] block text-[10px] uppercase font-mono">Time</span>
                    <span className="font-semibold text-[#202124]">{event.startTime} – {event.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[#80868B] block text-[10px] uppercase font-mono">Venue</span>
                    <span className="font-semibold text-[#202124] truncate block">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <Users className="w-5 h-5 text-[#1E8E3E] shrink-0" />
                  <div>
                    <span className="text-[#80868B] block text-[10px] uppercase font-mono">
                      {isUpcoming ? "Availability" : "Participants"}
                    </span>
                    <span className="font-semibold text-[#202124]">
                      {isUpcoming
                        ? `${event.seatsRemaining || 0} seats left (${event.totalSeats || 150} cap)`
                        : `${event.attendeesCount || 200}+ attended`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Countdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                <div className="flex flex-wrap items-center gap-3">
                  {isUpcoming ? (
                    <button
                      type="button"
                      id="details-primary-rsvp-btn"
                      onClick={() => onOpenRSVP(event.id)}
                      disabled={!event.registrationOpen}
                      className={`py-3.5 px-8 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
                        event.registrationOpen
                          ? "bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] cursor-pointer"
                          : "bg-neutral-200 text-neutral-500 cursor-not-allowed border border-neutral-300"
                      }`}
                    >
                      <span>{event.registrationOpen ? "RSVP / Register for Free" : "Registration Closed"}</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>This event has concluded successfully</span>
                    </div>
                  )}

                  <a
                    href="#agenda-section"
                    className="py-3.5 px-5 rounded-xl text-xs font-semibold text-[#3C4043] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-colors text-center shadow-2xs"
                  >
                    View Schedule Timeline
                  </a>

                  <button
                    type="button"
                    id="details-view-candidates-btn"
                    onClick={() => setIsCandidatesModalOpen(true)}
                    className="py-3.5 px-4 rounded-xl text-xs font-semibold text-[#3C4043] hover:text-[#202124] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Users className="w-4 h-4 text-[#1A73E8]" />
                    <span>RSVP Candidates ({eventCandidatesCount})</span>
                  </button>
                </div>

                {/* Compact Countdown if upcoming */}
                {isUpcoming && (
                  <div className="bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl flex items-center justify-center">
                    <Countdown targetDate={event.date} variant="compact" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAST EVENT OUTCOMES SECTION */}
      {!isUpcoming && event.outcomes && (
        <section id="past-outcomes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-[#202124] mb-6">Event Outcomes &amp; Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {event.outcomes.map((item, idx) => (
                <div key={idx} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1A73E8] block">{item.metric}</span>
                  <span className="text-xs text-[#5F6368] mt-1 block font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {event.highlights && (
              <div className="mt-6 pt-6 border-t border-neutral-100 space-y-2">
                <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider mb-2">Key Highlights</h4>
                <ul className="space-y-1.5">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="text-xs sm:text-sm text-[#3C4043] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. ABOUT THE EVENT */}
      <section id="about-event-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-2xl font-bold text-[#202124] tracking-tight">About the Event</h3>
              <p className="text-sm sm:text-base text-[#5F6368] leading-relaxed">
                {event.fullDescription}
              </p>
            </div>

            {/* What you will learn */}
            {event.whatYouWillLearn && (
              <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <h4 className="text-base font-bold text-[#202124] uppercase tracking-wider font-mono">
                  What You Will Learn &amp; Practice
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {event.whatYouWillLearn.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#3C4043]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prerequisites & What to bring card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Prerequisites */}
              {event.prerequisites && (
                <div>
                  <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-[#1A73E8]" />
                    <span>Prerequisites</span>
                  </h4>
                  <ul className="space-y-2">
                    {event.prerequisites.map((req, i) => (
                      <li key={i} className="text-xs text-[#5F6368] flex items-start gap-2">
                        <span className="text-[#1A73E8] font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What to bring */}
              {event.whatToBring && (
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-amber-600" />
                    <span>What to Bring</span>
                  </h4>
                  <ul className="space-y-2">
                    {event.whatToBring.map((item, i) => (
                      <li key={i} className="text-xs text-[#5F6368] flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT YOU'LL EXPERIENCE CARDS */}
      <section id="experience-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#202124] tracking-tight mb-6">What You'll Experience</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {experienceCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-white border border-[#DADCE0] rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <h4 className="text-sm font-bold text-[#202124]">{c.title}</h4>
                <p className="text-xs text-[#5F6368] leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EVENT AGENDAS & PERSONALIZED PLANNER */}
      <section id="agenda-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] mb-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Interactive Schedule</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
              Event Agenda
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
              Click any session to view in-depth details, takeaways, and speaker tags.
            </p>
          </div>
        </div>

        {/* Interactive Timeline */}
        <AgendaTimeline agenda={event.agenda || []} />

        {/* Personalized Event Plan Builder */}
        <PersonalizedPlan agenda={event.agenda || []} eventTitle={event.title} />
      </section>

      {/* 5. SPEAKERS SECTION */}
      {event.speakers && event.speakers.length > 0 && (
        <section id="speakers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
              Featured Speakers &amp; Mentors
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
              Learn directly from Google Developer Experts, industry leads, and student chapter organizers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </section>
      )}

      {/* 6. VENUE & TRAVEL SECTION */}
      <section id="venue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight mb-6">
          Venue &amp; Directions
        </h3>
        <VenueMap venue={event.venue} address={event.address} coordinates={event.mapCoordinates} />
      </section>

      {/* 7. EVENT-SPECIFIC FAQ */}
      {event.faqs && event.faqs.length > 0 && (
        <section id="event-faqs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] mb-2 shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
              Event FAQs
            </h3>
          </div>

          <div className="space-y-3">
            {event.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#DADCE0] rounded-2xl overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[#202124]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5F6368] transition-transform ${
                        isOpen ? "rotate-180 text-[#1A73E8]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5F6368] leading-relaxed border-t border-neutral-100 pt-3 bg-neutral-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. FINAL CTA */}
      <section id="event-final-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white border border-[#DADCE0] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
            {isUpcoming ? "Ready to join us?" : "Interested in upcoming events?"}
          </h3>
          <p className="text-sm text-[#5F6368] max-w-lg mx-auto mt-2">
            {isUpcoming
              ? "Seats are limited and allotted on a verified first-come basis. Confirm your registration to generate your digital QR entry pass."
              : "Explore our calendar for upcoming workshops and register to secure your spot."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isUpcoming ? (
              <button
                type="button"
                id="final-rsvp-button"
                onClick={() => onOpenRSVP(event.id)}
                disabled={!event.registrationOpen}
                className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>RSVP Now</span>
              </button>
            ) : (
              <Link
                to="/upcoming-events"
                className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-all shadow-sm"
              >
                View Upcoming Schedule
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Candidates Directory Modal */}
      <RSVPCandidatesModal
        isOpen={isCandidatesModalOpen}
        onClose={() => setIsCandidatesModalOpen(false)}
        defaultEventId={event.id}
      />
    </div>
  );
}
