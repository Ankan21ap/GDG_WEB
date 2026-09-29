import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Image as ImageIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Maximize2,
  History,
  Clock
} from "lucide-react";
import { GalleryImage, Event } from "../types";
import { GoogleDots } from "../components/GoogleColorsBar";
import { eventService } from "../services/eventService";
import { allEvents as canonicalEvents } from "../data/events";

export type GalleryTab = "upcoming" | "past";

export function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<GalleryTab>(
    tabParam === "past" ? "past" : "upcoming"
  );
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync tab with URL query parameter
  useEffect(() => {
    if (tabParam === "past" || tabParam === "upcoming") {
      setActiveTab(tabParam);
      setSelectedEventTitle("all");
      setActiveLightboxIndex(null);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: GalleryTab) => {
    setActiveTab(newTab);
    setSelectedEventTitle("all");
    setActiveLightboxIndex(null);
    setSearchParams({ tab: newTab });
  };

  // Fetch dynamic events directly from the MongoDB backend database
  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const events = await eventService.getAllEvents();
        if (isMounted) {
          setDbEvents(events);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading events from DB for gallery:", err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadEvents();

    const handleEventsUpdated = () => {
      loadEvents();
    };

    window.addEventListener("gdg_events_updated", handleEventsUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("gdg_events_updated", handleEventsUpdated);
    };
  }, []);

  // Construct gallery pictures exclusively from the DB events & registered events
  const allImages = useMemo<GalleryImage[]>(() => {
    const list: GalleryImage[] = [];
    const seenUrls = new Set<string>();

    // Combine DB events with canonical event records to ensure all active events have rich imagery
    const combinedEvents: Event[] = [...dbEvents];
    const existingSlugs = new Set(dbEvents.map((e) => (e.slug || e.id || e.title).toLowerCase().trim()));

    canonicalEvents.forEach((ce) => {
      const slugKey = (ce.slug || ce.id || ce.title).toLowerCase().trim();
      if (!existingSlugs.has(slugKey)) {
        combinedEvents.push(ce);
      }
    });

    combinedEvents.forEach((ev) => {
      const status: "upcoming" | "past" = ev.status === "upcoming" ? "upcoming" : "past";

      // 1. Primary event cover image from DB
      if (ev.image && !seenUrls.has(ev.image)) {
        seenUrls.add(ev.image);
        list.push({
          id: `ev-cover-${ev.id}`,
          title: ev.title,
          caption: ev.shortDescription || ev.fullDescription || ev.description || ev.title,
          eventTitle: ev.title,
          date: ev.displayDate || "FIEM Campus",
          category: ev.category || ev.type,
          eventStatus: status,
          imageUrl: ev.image
        });
      }

      // 2. Extra gallery moment images attached to this event
      if (Array.isArray(ev.galleryImages)) {
        ev.galleryImages.forEach((imgUrl, idx) => {
          if (imgUrl && !seenUrls.has(imgUrl)) {
            seenUrls.add(imgUrl);
            list.push({
              id: `ev-gal-${ev.id}-${idx}`,
              title: `${ev.title} — Session Highlight ${idx + 1}`,
              caption: ev.shortDescription || ev.title,
              eventTitle: ev.title,
              date: ev.displayDate || "FIEM Campus",
              category: ev.category || ev.type,
              eventStatus: status,
              imageUrl: imgUrl
            });
          }
        });
      }
    });

    return list;
  }, [dbEvents]);

  // Strictly upcoming event pictures from DB
  const upcomingImages = useMemo(() => {
    return allImages.filter((img) => img.eventStatus === "upcoming");
  }, [allImages]);

  // Strictly past event pictures from DB
  const pastImages = useMemo(() => {
    return allImages.filter((img) => img.eventStatus === "past");
  }, [allImages]);

  // Available event filter pills for the currently active tab
  const availableEventTitles = useMemo(() => {
    const targetSet = activeTab === "upcoming" ? upcomingImages : pastImages;
    return Array.from(new Set(targetSet.map((img) => img.eventTitle))).filter(Boolean);
  }, [activeTab, upcomingImages, pastImages]);

  // Filtered images for currently active tab and selected specific event
  const filteredImages = useMemo(() => {
    const baseList = activeTab === "upcoming" ? upcomingImages : pastImages;
    if (selectedEventTitle === "all") {
      return baseList;
    }
    return baseList.filter((img) => img.eventTitle === selectedEventTitle);
  }, [activeTab, selectedEventTitle, upcomingImages, pastImages]);

  const activeImage: GalleryImage | null =
    activeLightboxIndex !== null ? filteredImages[activeLightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredImages.length - 1
    );
  }, [activeLightboxIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! < filteredImages.length - 1 ? prev! + 1 : 0
    );
  }, [activeLightboxIndex, filteredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, handleNext, handlePrev]);

  return (
    <div id="gallery-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#F8F9FA] text-[#202124]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>Events Photo Gallery</span>
          <GoogleDots />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
          Event Gallery &amp; Moments
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368]">
          Official visual archives from GDG on Campus FIEM. Browse live pictures from our Upcoming and Past Events.
        </p>
      </div>

      {/* Dynamic Navigation Bar: Exclusively Upcoming Events & Past Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <nav 
            aria-label="Gallery Events Navigation" 
            className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-[#DADCE0] shadow-sm max-w-full overflow-x-auto"
          >
            {/* 1. Upcoming Events Tab */}
            <button
              type="button"
              id="gallery-tab-upcoming"
              onClick={() => handleTabChange("upcoming")}
              className={`py-2.5 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "bg-[#1A73E8] text-white shadow-xs"
                  : "text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] inline-block animate-pulse" />
              <span>Upcoming Events</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "upcoming" ? "bg-white/25 text-white font-bold" : "bg-emerald-50 text-[#137333] border border-emerald-200"
              }`}>
                {upcomingImages.length}
              </span>
            </button>

            {/* 2. Past Events Tab */}
            <button
              type="button"
              id="gallery-tab-past"
              onClick={() => handleTabChange("past")}
              className={`py-2.5 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                activeTab === "past"
                  ? "bg-[#1A73E8] text-white shadow-xs"
                  : "text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Past Events</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "past" ? "bg-white/25 text-white font-bold" : "bg-neutral-100 text-[#5F6368]"
              }`}>
                {pastImages.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Dynamic Specific Event Filter Pills for Selected Tab */}
        {availableEventTitles.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
            <button
              type="button"
              id="gallery-subfilter-all"
              onClick={() => {
                setSelectedEventTitle("all");
                setActiveLightboxIndex(null);
              }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedEventTitle === "all"
                  ? "bg-[#202124] text-white font-semibold shadow-2xs"
                  : "bg-white text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50 border border-[#DADCE0]"
              }`}
            >
              All {activeTab === "upcoming" ? "Upcoming" : "Past"} ({activeTab === "upcoming" ? upcomingImages.length : pastImages.length})
            </button>

            {availableEventTitles.map((title) => {
              const currentList = activeTab === "upcoming" ? upcomingImages : pastImages;
              const count = currentList.filter((img) => img.eventTitle === title).length;

              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => {
                    setSelectedEventTitle(title);
                    setActiveLightboxIndex(null);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedEventTitle === title
                      ? "bg-[#202124] text-white font-semibold shadow-2xs"
                      : "bg-white text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50 border border-[#DADCE0]"
                  }`}
                >
                  <span className="truncate max-w-[220px]">{title}</span>
                  <span className="text-[10px] font-mono opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              id={`gallery-thumb-${img.id}`}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#DADCE0] cursor-pointer aspect-[4/3] shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-300"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Hover overlay details */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                    img.eventStatus === "upcoming"
                      ? "bg-emerald-50/95 text-[#137333] border border-emerald-200"
                      : "bg-white/95 text-[#202124] border border-neutral-200"
                  }`}>
                    {img.eventStatus === "upcoming" ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                        <span>Upcoming Event</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-[#5F6368]" />
                        <span>Past Event</span>
                      </>
                    )}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-blue-300 font-mono flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{img.date} • {img.eventTitle}</span>
                  </span>
                  <h4 className="text-base font-bold text-white leading-snug group-hover:text-blue-200 transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-xs text-neutral-300 line-clamp-2 mt-1">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-[#5F6368] flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#202124]">
              No moments found
            </h3>
            <p className="text-xs text-[#5F6368]">
              No gallery images found for {selectedEventTitle !== "all" ? `"${selectedEventTitle}"` : `this ${activeTab} events view`}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedEventTitle("all")}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Show All in this section
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveLightboxIndex(null);
          }}
        >
          {/* Close button */}
          <button
            type="button"
            id="close-lightbox-btn"
            onClick={() => setActiveLightboxIndex(null)}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            id="prev-lightbox-btn"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            type="button"
            id="next-lightbox-btn"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-white rounded-3xl overflow-hidden border border-[#DADCE0] shadow-2xl">
            <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            {/* Captions & metadata */}
            <div className="p-6 bg-white border-t border-neutral-100 space-y-2 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5F6368]">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                    activeImage.eventStatus === "upcoming"
                      ? "bg-emerald-50 text-[#137333] border border-emerald-200"
                      : "bg-blue-50 text-[#1A73E8] border border-blue-200"
                  }`}>
                    {activeImage.eventStatus === "upcoming" ? "Upcoming Event" : "Past Event"}
                  </span>
                  <span className="font-medium text-[#202124]">{activeImage.eventTitle}</span>
                </div>
                <span className="font-mono">{activeImage.date}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#202124]">
                {activeImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
                {activeImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
