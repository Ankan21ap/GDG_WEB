import { useState } from "react";
import { Sparkles, Compass, Check } from "lucide-react";
import { Event } from "../types";
import { EventCard } from "./EventCard";

interface SmartDiscoveryProps {
  events: Event[];
  onOpenRSVP: (eventId: string) => void;
}

const INTERESTS = [
  { id: "AI", label: "Generative AI & Gemini" },
  { id: "Web", label: "Modern Web & React" },
  { id: "Cloud", label: "Google Cloud & DevOps" },
  { id: "Android", label: "Android & Compose" },
  { id: "Career", label: "Tech Careers & Mentorship" },
  { id: "Hackathon", label: "Hackathons & Sprints" },
];

export function SmartDiscovery({ events, onOpenRSVP }: SmartDiscoveryProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["AI"]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const filteredEvents = events.filter((e) =>
    selectedInterests.some(
      (interest) =>
        e.category === interest ||
        e.title.toLowerCase().includes(interest.toLowerCase()) ||
        e.shortDescription.toLowerCase().includes(interest.toLowerCase())
    )
  );

  return (
    <section id="smart-event-discovery" className="py-12 bg-white border-y border-[#DADCE0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200 mb-3">
              <Compass className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Smart Event Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
              What are you interested in?
            </h2>
            <p className="text-sm text-[#5F6368] mt-1">
              Select one or more developer domains to tailor recommendations for your campus learning path.
            </p>
          </div>

          <div className="text-xs text-[#5F6368] font-mono">
            Matching <span className="text-[#202124] font-bold">{filteredEvents.length}</span> recommended events
          </div>
        </div>

        {/* Interest Selector Pills */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                id={`interest-chip-${item.id.toLowerCase()}`}
                onClick={() => toggleInterest(item.id)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-[#1A73E8] border-[#1A73E8] shadow-xs font-semibold ring-1 ring-[#1A73E8]/30"
                    : "bg-neutral-50 text-[#5F6368] border-neutral-200 hover:text-[#202124] hover:bg-neutral-100 hover:border-neutral-300"
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-[#1A73E8]" />
                ) : (
                  <Sparkles className="w-3 h-3 text-neutral-400" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recommended Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} onOpenRSVP={onOpenRSVP} />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center">
            <p className="text-[#3C4043] font-medium">No direct match found for this filter combination.</p>
            <button
              type="button"
              onClick={() => setSelectedInterests(["AI", "Web"])}
              className="mt-3 text-xs text-[#1A73E8] hover:underline font-semibold"
            >
              Reset to Recommended Topics
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
