import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onOpenRSVP?: (eventId: string) => void;
}

export function EventCard({ event, onOpenRSVP }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";

  // Category badge color in Google Light Theme
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "AI":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cloud":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Android":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Web":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Hackathon":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <article
      id={`event-card-${event.slug}`}
      className="group bg-white hover:bg-white border border-[#DADCE0] hover:border-neutral-300 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-xs hover:shadow-md"
    >
      {/* Banner Image with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${getCategoryBadgeClass(
              event.category || "AI"
            )}`}
          >
            {event.category || event.type} • {event.type}
          </span>

          {isUpcoming ? (
            event.registrationOpen ? (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>RSVP Open</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 backdrop-blur-md shadow-xs">
                Seats Full
              </span>
            )
          ) : (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-neutral-700 border border-neutral-200 backdrop-blur-md shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Concluded</span>
            </span>
          )}
        </div>

        {/* Seats Remaining Pill for Upcoming */}
        {isUpcoming && event.seatsRemaining !== undefined && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-white/95 text-[#202124] border border-neutral-200 backdrop-blur-md shadow-sm flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#1A73E8]" />
              <span>{event.seatsRemaining} seats left</span>
            </span>
          </div>
        )}

        {/* Attendees Count for Past */}
        {!isUpcoming && event.attendeesCount && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-white/95 text-[#202124] border border-neutral-200 backdrop-blur-md shadow-sm flex items-center gap-1.5">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>{event.attendeesCount} participants</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F6368] mb-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span className="font-medium text-[#3C4043]">{event.displayDate}</span>
            </div>
            <span className="text-neutral-400">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#202124] group-hover:text-[#1A73E8] transition-colors line-clamp-1 mb-2">
            <Link to={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-sm text-[#5F6368] line-clamp-2 mb-4 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Venue */}
          <div className="flex items-start gap-1.5 text-xs text-[#5F6368] mb-4">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Speakers & Actions Footer */}
        <div className="pt-4 border-t border-neutral-100 mt-auto">
          {/* Speaker Avatar Stack */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center -space-x-2">
                {event.speakers.slice(0, 3).map((speaker) => (
                  <img
                    key={speaker.id}
                    src={speaker.avatar}
                    alt={speaker.name}
                    title={`${speaker.name} (${speaker.role})`}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                ))}
                {event.speakers.length > 3 && (
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-neutral-100 text-[10px] font-bold text-[#5F6368] flex items-center justify-center">
                    +{event.speakers.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-[#5F6368] font-medium">
                {event.speakers[0]?.name}
                {event.speakers.length > 1 ? ` +${event.speakers.length - 1}` : ""}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/events/${event.slug}`}
              id={`view-details-${event.slug}`}
              className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-semibold text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>{isUpcoming ? "View Details" : "View Event"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isUpcoming && onOpenRSVP && (
              <button
                type="button"
                id={`rsvp-btn-${event.slug}`}
                onClick={() => onOpenRSVP(event.id)}
                disabled={!event.registrationOpen}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  event.registrationOpen
                    ? "text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] shadow-xs cursor-pointer"
                    : "text-neutral-400 bg-neutral-100 cursor-not-allowed border border-neutral-200"
                }`}
              >
                <span>RSVP</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
