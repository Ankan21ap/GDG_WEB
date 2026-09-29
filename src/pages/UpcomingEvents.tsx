import { useState, useEffect } from "react";
import { Search, Calendar, Filter, PlusCircle, Code2, Users } from "lucide-react";
import { EventCard } from "../components/EventCard";
import { Countdown } from "../components/Countdown";
import { RegisterEventModal } from "../components/RegisterEventModal";
import { RSVPCandidatesModal } from "../components/RSVPCandidatesModal";
import { eventService } from "../services/eventService";
import { registrationService } from "../services/registrationService";
import { Event } from "../types";

interface UpcomingEventsProps {
  onOpenRSVP: (eventId?: string) => void;
}

export function UpcomingEvents({ onOpenRSVP }: UpcomingEventsProps) {
  const [upcomingList, setUpcomingList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [candidateCount, setCandidateCount] = useState<number>(
    registrationService.getRegistrations().length
  );

  // Fetch events and candidates from backend on mount
  useEffect(() => {
    eventService.getUpcomingEvents().then((events) => {
      setUpcomingList(events);
      setLoading(false);
    });
    registrationService.fetchRegistrationsFromDb().then((list) => {
      setCandidateCount(list.length);
    });
  }, []);

  // Refresh when events or RSVPs are updated
  useEffect(() => {
    const handleEventsUpdated = () => {
      eventService.getUpcomingEvents().then(setUpcomingList);
    };
    const handleRegistrationsUpdated = () => {
      registrationService.fetchRegistrationsFromDb().then((list) => {
        setCandidateCount(list.length);
      });
    };
    window.addEventListener("gdg_events_updated", handleEventsUpdated);
    window.addEventListener("gdg_registrations_updated", handleRegistrationsUpdated);
    return () => {
      window.removeEventListener("gdg_events_updated", handleEventsUpdated);
      window.removeEventListener("gdg_registrations_updated", handleRegistrationsUpdated);
    };
  }, []);

  const categories = ["All", "AI", "Cloud", "Android", "Web", "Hackathon", "Workshop", "Meetup", "Career"];

  const filteredEvents = upcomingList.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" ||
      evt.category === selectedCategory ||
      evt.type === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextEvent = upcomingList[0];

  return (
    <div id="upcoming-events-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#F8F9FA] text-[#202124]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Tech Schedule</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-sm sm:text-base text-[#5F6368]">
            Discover hands-on workshops, bootcamps, and hackathons hosted by GDG on Campus FIEM. Reserve your seat and receive your digital QR pass.
          </p>
        </div>

        {/* Register New Event & View RSVP Candidates Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCandidatesModalOpen(true)}
            id="view-rsvp-candidates-btn"
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-[#3C4043] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#1A73E8]" />
            <span>View RSVP Candidates</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
              {candidateCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            id="register-new-event-btn"
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
          >
            <PlusCircle className="w-4 h-4 text-blue-100 group-hover:rotate-90 transition-transform duration-300" />
            <span>Register New Event</span>
          </button>
        </div>
      </div>

      {/* Organizer & Student Lead Notice Banner */}
      <div className="bg-white border border-[#DADCE0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1A73E8] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Event Organizer Hub
              </span>
            </div>
            <p className="text-xs text-[#5F6368] mt-0.5">
              Have an idea for an AI workshop, sprint, or study jam on FIEM campus? Use our registered event form to create and publish a new event for the community.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCandidatesModalOpen(true)}
            id="banner-view-candidates-btn"
            className="py-2 px-3.5 rounded-xl text-xs font-semibold text-[#3C4043] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Candidates ({candidateCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            id="banner-register-new-event-btn"
            className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Featured Countdown Banner if nextEvent exists */}
      {nextEvent && (
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-mono text-amber-700 font-semibold uppercase tracking-wider">
                Next Live Event
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1A73E8] border border-blue-200 font-mono">
                {nextEvent.type}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
              {nextEvent.title}
            </h3>
            <p className="text-sm text-[#5F6368]">
              {nextEvent.displayDate} • {nextEvent.startTime} • {nextEvent.venue}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenRSVP(nextEvent.id)}
                className="py-2.5 px-5 rounded-xl font-semibold text-xs text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Instant RSVP</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Countdown targetDate={nextEvent.date} variant="cards" />
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#80868B] pointer-events-none" />
          <input
            type="text"
            placeholder="Search upcoming events by title, track, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#DADCE0] rounded-xl pl-10 pr-4 py-2 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8] transition-colors shadow-2xs"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#5F6368] hidden sm:inline-block mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1A73E8] text-white shadow-xs"
                  : "bg-white text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50 border border-[#DADCE0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onOpenRSVP={onOpenRSVP} />
          ))}
        </div>
      ) : (
        /* Empty State with Register button */
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-[#5F6368] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#202124]">No upcoming events found</h3>
            <p className="text-xs text-[#5F6368]">
              No events match "{searchQuery}" under "{selectedCategory}". You can reset filters or register a new event right away.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-[#1A73E8] bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register New Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Register New Event Modal Dialog */}
      <RegisterEventModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onEventCreated={() => {
          eventService.getUpcomingEvents().then(setUpcomingList);
        }}
      />

      {/* RSVP Candidates Directory Modal */}
      <RSVPCandidatesModal
        isOpen={isCandidatesModalOpen}
        onClose={() => {
          setIsCandidatesModalOpen(false);
          setCandidateCount(registrationService.getRegistrations().length);
        }}
      />
    </div>
  );
}
