import { useState, useEffect } from "react";
import { Search, History, Filter } from "lucide-react";
import { EventCard } from "../components/EventCard";
import { eventService } from "../services/eventService";
import { Event } from "../types";

export function PastEvents() {
  const [allPast, setAllPast] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    eventService.getPastEvents().then(setAllPast);
  }, []);

  const categories = ["All", "AI", "Web", "Cloud", "Android", "Career", "Hackathon"];

  const filteredEvents = allPast.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="past-events-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#F8F9FA] text-[#202124]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] shadow-2xs">
          <History className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>Community Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
          Past Events
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368]">
          Browse through previous conferences, hackathons, and technical bootcamps organized by GDG on Campus FIEM. Explore speaker archives, session outcomes, and photo highlights.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#80868B] pointer-events-none" />
          <input
            type="text"
            id="search-past-events-input"
            placeholder="Search past events by name, topic..."
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
              id={`filter-past-${cat.toLowerCase()}`}
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
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-[#5F6368] flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202124]">No archived events match</h3>
          <p className="text-xs text-[#5F6368]">
            Try adjusting your search terms or category selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
