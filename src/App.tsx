import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { RSVPModal } from "./components/RSVPModal";
import { CheckCircle2, X } from "lucide-react";
import { Home } from "./pages/Home";
import { UpcomingEvents } from "./pages/UpcomingEvents";
import { PastEvents } from "./pages/PastEvents";
import { EventDetails } from "./pages/EventDetails";
import { Gallery } from "./pages/Gallery";
import { About } from "./pages/About";
import { FAQPage } from "./pages/FAQPage";
import { ConnectPage } from "./pages/ConnectPage";
import { ModelsPage } from "./pages/ModelsPage";
import { eventService } from "./services/eventService";
import { Event } from "./types";

// Scroll to top automatically on route transitions
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventService.getUpcomingEvents().then(setUpcomingEvents);
  }, []);

  useEffect(() => {
    const handleEventsUpdated = () => {
      eventService.getUpcomingEvents().then(setUpcomingEvents);
    };
    window.addEventListener("gdg_events_updated", handleEventsUpdated);
    return () => window.removeEventListener("gdg_events_updated", handleEventsUpdated);
  }, []);

  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [activeRSVPEventId, setActiveRSVPEventId] = useState<string | undefined>(
    upcomingEvents[0]?.id
  );
  const [rsvpNotification, setRsvpNotification] = useState<{
    name: string;
    ticketId: string;
    eventTitle: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    const handleSuccess = (e: any) => {
      const reg = e.detail?.registration;
      if (reg) {
        setRsvpNotification({
          name: reg.name || reg.fullName,
          ticketId: reg.registrationId || reg.id,
          eventTitle: reg.eventTitle || "GDG Event",
          phone: reg.phone,
        });
      }
    };
    window.addEventListener("gdg_rsvp_success", handleSuccess);
    return () => window.removeEventListener("gdg_rsvp_success", handleSuccess);
  }, []);

  const handleOpenRSVP = (eventId?: string) => {
    if (eventId) {
      setActiveRSVPEventId(eventId);
    } else if (upcomingEvents.length > 0) {
      setActiveRSVPEventId(upcomingEvents[0].id);
    }
    setIsRSVPOpen(true);
  };

  const handleCloseRSVP = () => {
    setIsRSVPOpen(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Persistent Sticky Navbar */}
        <Navbar onOpenRSVP={handleOpenRSVP} />

        {/* Main Routed Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onOpenRSVP={handleOpenRSVP} />} />
            <Route
              path="/upcoming-events"
              element={<UpcomingEvents onOpenRSVP={handleOpenRSVP} />}
            />
            <Route path="/past-events" element={<PastEvents />} />
            <Route
              path="/events/:slug"
              element={<EventDetails onOpenRSVP={handleOpenRSVP} />}
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/models" element={<ModelsPage onOpenRSVP={handleOpenRSVP} />} />
            {/* Fallback route back to home */}
            <Route path="*" element={<Home onOpenRSVP={handleOpenRSVP} />} />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />

        {/* Global RSVP / Registration Pass Modal */}
        <RSVPModal
          isOpen={isRSVPOpen}
          onClose={handleCloseRSVP}
          upcomingEvents={upcomingEvents}
          initialEventId={activeRSVPEventId}
        />

        {/* Floating Page-Level SMS / RSVP Complete Toast */}
        {rsvpNotification && (
          <aside aria-label="RSVP Notification" className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-full bg-white border border-emerald-500/60 rounded-2xl p-4 shadow-xl backdrop-blur-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#202124]">RSVP Complete!</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                    SMS Sent
                  </span>
                </div>
                <p className="text-xs text-[#5F6368] mt-1 leading-snug">
                  Welcome, <strong className="text-[#202124]">{rsvpNotification.name}</strong>! Confirmed for <span className="text-[#202124] font-medium">{rsvpNotification.eventTitle}</span>.
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100 text-[11px] font-mono">
                  <span className="text-[#70757A]">Ticket ID:</span>
                  <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rsvpNotification.ticketId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRsvpNotification(null)}
                aria-label="Close notification"
                className="text-[#70757A] hover:text-[#202124] p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </BrowserRouter>
  );
}
