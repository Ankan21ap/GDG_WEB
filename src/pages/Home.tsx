import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Code2, 
  Cpu, 
  Cloud, 
  Globe, 
  Smartphone, 
  BookOpen, 
  Hammer, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  History,
  MapPin,
  Image as ImageIcon,
  PlusCircle,
  HelpCircle,
  MessageSquareQuote,
  Flame,
  Check
} from "lucide-react";
import { eventService } from "../services/eventService";
import { RegisterEventModal } from "../components/RegisterEventModal";
import { EventCard } from "../components/EventCard";
import { Countdown } from "../components/Countdown";
import { SmartDiscovery } from "../components/SmartDiscovery";
import { GoogleDots } from "../components/GoogleColorsBar";
import { GDGLogo } from "../components/GDGLogo";
import { Event } from "../types";

interface HomeProps {
  onOpenRSVP: (eventId?: string) => void;
}

export function Home({ onOpenRSVP }: HomeProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const featuredEvent = upcomingEvents[0];

  // Fetch events from backend on mount
  useEffect(() => {
    eventService.getUpcomingEvents().then(setUpcomingEvents);
    eventService.getPastEvents().then(setPastEvents);
  }, []);

  useEffect(() => {
    const handleEventsUpdated = () => {
      eventService.getUpcomingEvents().then(setUpcomingEvents);
      eventService.getPastEvents().then(setPastEvents);
    };
    window.addEventListener("gdg_events_updated", handleEventsUpdated);
    return () => window.removeEventListener("gdg_events_updated", handleEventsUpdated);
  }, []);

  // Interactive state for Recent Event showcase on Home page front
  const [selectedRecentIndex, setSelectedRecentIndex] = useState(0);
  const activeRecent = pastEvents[selectedRecentIndex] || pastEvents[0];

  const pillars = [
    {
      title: "Learn",
      tagline: "Workshops, talks and technical codelabs.",
      desc: "Demystify modern tech stacks with hands-on labs on Gemini AI, Google Cloud, Android Compose, and TypeScript directly from Google Developer Experts.",
      points: ["Hands-on Gemini AI & Cloud Labs", "Interactive Codelabs & Workbooks", "Sessions by Google Developer Experts"],
      icon: BookOpen,
      color: "text-[#1A73E8]",
      accentBorder: "hover:border-[#1A73E8]/50",
      accentBg: "bg-blue-50",
      accentText: "text-[#1A73E8]",
      border: "border-blue-200"
    },
    {
      title: "Build",
      tagline: "Projects, hackathons and hands-on sprints.",
      desc: "Turn theory into working production code. Collaborate in campus hackathons, build open-source utilities, and compete in the global Google Solution Challenge.",
      points: ["Google Solution Challenge Support", "Campus DevFest & Hackathons", "Open Source Repositories & Reviews"],
      icon: Hammer,
      color: "text-[#EA4335]",
      accentBorder: "hover:border-[#EA4335]/50",
      accentBg: "bg-red-50",
      accentText: "text-[#EA4335]",
      border: "border-red-200"
    },
    {
      title: "Connect",
      tagline: "Meet developers, speakers and mentors.",
      desc: "Network with senior engineering mentors, alumni working in top product companies, and like-minded campus peers across computer science and engineering disciplines.",
      points: ["1-on-1 Engineering Mentorship", "Active Discord & Study Circles", "Alumni in Top Product Companies"],
      icon: Users,
      color: "text-[#F9AB00]",
      accentBorder: "hover:border-[#FBBC04]/60",
      accentBg: "bg-amber-50",
      accentText: "text-amber-700",
      border: "border-amber-200"
    },
    {
      title: "Grow",
      tagline: "Develop technical and professional skills.",
      desc: "Sharpen your code architecture, leadership, public speaking, and team sprint skills to accelerate your journey from student to industry engineer.",
      points: ["Google Cloud & AI Skill Badges", "Resume Reviews & Mock Interviews", "Public Speaking & Tech Leadership"],
      icon: TrendingUp,
      color: "text-[#1E8E3E]",
      accentBorder: "hover:border-[#34A853]/50",
      accentBg: "bg-emerald-50",
      accentText: "text-[#1E8E3E]",
      border: "border-emerald-200"
    }
  ];

  const techBadges = [
    { label: "Generative AI & Gemini", icon: Cpu, color: "text-[#1A73E8]", border: "hover:border-blue-300 hover:bg-blue-50/50" },
    { label: "Google Cloud Platform", icon: Cloud, color: "text-[#EA4335]", border: "hover:border-red-300 hover:bg-red-50/50" },
    { label: "Web Architecture & React", icon: Globe, color: "text-[#F9AB00]", border: "hover:border-amber-300 hover:bg-amber-50/50" },
    { label: "Android & Jetpack Compose", icon: Smartphone, color: "text-[#1E8E3E]", border: "hover:border-emerald-300 hover:bg-emerald-50/50" },
    { label: "Solution Challenge", icon: Code2, color: "text-purple-600", border: "hover:border-purple-300 hover:bg-purple-50/50" },
  ];

  const studentTestimonials = [
    {
      quote: "The Gemini AI Study Jam took me from reading documentation to actually building and deploying a multimodal project with an awesome campus team.",
      name: "Subham Debnath",
      dept: "Computer Science & Engineering, 3rd Year",
      badge: "AI Track Lead"
    },
    {
      quote: "Getting direct guidance from Google Developer Experts on our campus gave me the exact clarity needed to earn my first Google Cloud Skill Badge.",
      name: "Priya Mukherjee",
      dept: "Information Technology, 4th Year",
      badge: "Cloud Jam Finisher"
    },
    {
      quote: "GDG on Campus FIEM provides a genuine builder culture. You do not just watch slides; you write code, test APIs, and ship working apps.",
      name: "Rahul Karmakar",
      dept: "Electronics & Communication, 2nd Year",
      badge: "Hackathon Participant"
    }
  ];

  const homeFaqs = [
    {
      q: "Who can join GDG on Campus FIEM?",
      a: "Any student enrolled at Future Institute of Engineering and Management (FIEM) — across any department (CSE, IT, ECE, EE, MCA, etc.) and year of study — is welcome to join. We also welcome participants from other colleges for our open flagships!"
    },
    {
      q: "Are GDG events free of charge?",
      a: "Yes, 100%! All workshops, study jams, speaker sessions, and hackathons organized by GDG on Campus FIEM are completely free for students."
    },
    {
      q: "How does the RSVP and QR Pass work?",
      a: "When you RSVP through this portal, a verified Ticket ID and high-contrast digital QR Pass are instantly generated. You also receive an on-screen SMS confirmation preview. Simply present your digital QR pass at the campus check-in desk on event day."
    },
    {
      q: "Do I need prior programming experience?",
      a: "Not at all! We host beginner-level codelabs and zero-to-hero sessions alongside advanced project sprints. Whether you are writing your first line of code or deploying production AI models, there is a place for you."
    }
  ];

  return (
    <div id="home-page" className="space-y-12 sm:space-y-18 bg-[#F8F9FA] text-[#202124]">
      {/* SECTION: HERO SECTION */}
      <section id="hero-section" className="relative pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 overflow-hidden bg-dot-pattern">
        {/* Subtle decorative Google brand ambient glows */}
        <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-amber-500/5 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-5 sm:space-y-6 flex flex-col items-center">
            {/* Main Headline - GDG on Campus FIEM */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight leading-[1.2] max-w-4xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#EA4335] via-[#FBBC04] to-[#34A853]">
                GDG on Campus
              </span>
              <span className="block mt-1 sm:mt-2 text-xl sm:text-3xl lg:text-4xl text-[#202124] font-bold">
                Future Institute of Engineering &amp; Management
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5F6368] bg-[#F1F3F4] px-3.5 py-1 rounded-full border border-[#DADCE0]">
                  <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                  Kolkata, India
                </span>
              </div>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#5F6368] max-w-xl leading-relaxed font-normal">
              Welcome to the student developer chapter at Future Institute of Engineering and Management. Learn hands-on with Gemini AI, Google Cloud, Android, and modern Web architecture alongside passionate peers and industry mentors.
            </p>

            {/* Primary Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                to="/upcoming-events"
                id="hero-explore-events-btn"
                className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Upcoming Schedule</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/connect"
                id="hero-join-connect-btn"
                className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Join Community</span>
              </Link>
            </div>

            {/* Team Photo Showcase - Scaled & Balanced for Standard Viewport */}
            <div className="w-full pt-2">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DADCE0] shadow-md bg-white group transition-all duration-300 hover:shadow-xl">
                {/* Top Google 4-Color Accent Strip */}
                <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

                {/* Clear, unobstructed team photo */}
                <div className="relative w-full max-h-[380px] sm:max-h-[440px] overflow-hidden bg-neutral-100 flex items-center justify-center">
                  <img
                    src="/gdg-team.png"
                    alt="GDG on Campus FIEM Team and Community"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                  />
                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DADCE0] text-[11px] sm:text-xs font-semibold text-[#202124] shadow-xs">
                      <GDGLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>GDG on Campus FIEM</span>
                    </div>
                  </div>

                  {/* Bottom Caption Overlay Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 text-left z-10">
                    <div className="text-white font-bold text-sm sm:text-base drop-shadow-sm flex items-center gap-2">
                      <span>Our Chapter Community &amp; Organizers</span>
                      <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                    </div>
                    <p className="text-white/90 text-[11px] sm:text-xs drop-shadow-xs mt-0.5">
                      Future Institute of Engineering and Management • Kolkata
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Metric Highlights */}
            <div className="pt-4 sm:pt-5 border-t border-neutral-200/80 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#DADCE0] shadow-2xs text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#202124] font-mono flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                  500+
                </div>
                <div className="text-[11px] sm:text-xs text-[#5F6368] font-medium mt-0.5">Active Builders</div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#DADCE0] shadow-2xs text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#B06000] font-mono flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
                  18+
                </div>
                <div className="text-[11px] sm:text-xs text-[#5F6368] font-medium mt-0.5">Hands-on Workshops</div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#DADCE0] shadow-2xs text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#137333] font-mono flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                  100%
                </div>
                <div className="text-[11px] sm:text-xs text-[#5F6368] font-medium mt-0.5">Free Student Access</div>
              </div>
            </div>

            {/* Technologies We Explore Pills */}
            <div className="pt-1 flex flex-col items-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-[#5F6368] uppercase tracking-wider block mb-2 font-semibold">
                Technologies We Explore On Campus
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {techBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-[#DADCE0] text-[11px] sm:text-xs font-medium text-[#3C4043] transition-all shadow-2xs ${badge.border}`}
                    >
                      <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${badge.color}`} />
                      <span>{badge.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMUNITY PILLARS (LEARN, BUILD, CONNECT, GROW) */}
      <section id="community-pillars-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] mb-3 shadow-2xs">
            <GoogleDots />
            <span>Core Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
            How We Empower Student Developers
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] mt-3 leading-relaxed">
            Google Developer Groups on Campus FIEM provides a structured progression path — helping you learn high-demand technologies, collaborate on real products, expand your network, and prepare for industry engineering careers.
          </p>
        </div>

        {/* 4 Pillars Grid: Learn, Build, Connect, Grow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                id={`pillar-card-${pillar.title.toLowerCase()}`}
                className={`group bg-white border ${pillar.border} ${pillar.accentBorder} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${pillar.accentBg} border ${pillar.border} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#202124] mb-1">{pillar.title}</h3>
                  <p className="text-xs font-semibold text-[#3C4043] mb-3 font-mono">{pillar.tagline}</p>
                  <p className="text-xs text-[#5F6368] leading-relaxed mb-4">{pillar.desc}</p>

                  {/* Pillar Key Points Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    {pillar.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-[#3C4043]">
                        <Check className={`w-3 h-3 ${pillar.accentText} shrink-0`} />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-semibold text-[#3C4043]">
                  <span>Explore in workshops</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: RECENT EVENT SPOTLIGHT ON HOME PAGE FRONT */}
      {activeRecent && (
        <section id="recent-event-front-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Subtle Ambient Radial Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
                  <GoogleDots />
                  <span>Recent Event Spotlight • Campus Milestone</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#202124] tracking-tight">
                  Recent Milestone: {activeRecent.title}
                </h2>
                <p className="text-sm sm:text-base text-[#5F6368] mt-2 max-w-2xl leading-relaxed">
                  Take a look back at key achievements, student project demos, speaker sessions, and community memories from our recently concluded campus event.
                </p>
              </div>

              {/* Quick action buttons on header */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                <Link
                  to={`/events/${activeRecent.slug}`}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Full Event Recap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/gallery"
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <ImageIcon className="w-4 h-4 text-[#5F6368]" />
                  <span>Photo Gallery</span>
                </Link>
                <Link
                  to="/past-events"
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#5F6368] hover:text-[#202124] transition-colors flex items-center gap-1"
                >
                  <span>All Past ({pastEvents.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Recent Event Switcher Bar (Allow switching between top past events) */}
            {pastEvents.length > 1 && (
              <div className="pt-6 pb-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-xs font-mono text-[#5F6368] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-[#5F6368]" />
                  <span>Select Event:</span>
                </span>
                {pastEvents.slice(0, 4).map((evt, idx) => {
                  const isActive = selectedRecentIndex === idx;
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setSelectedRecentIndex(idx)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive
                          ? "bg-blue-50 text-[#1A73E8] border-[#1A73E8] font-semibold shadow-xs"
                          : "bg-white text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#1A73E8]" : "bg-neutral-400"}`} />
                      <span>{evt.title.split(":")[0]}</span>
                      {evt.attendeesCount && (
                        <span className="text-[10px] font-mono text-[#5F6368] bg-neutral-100 px-1.5 py-0.5 rounded">
                          {evt.attendeesCount}+
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Recent Event Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              {/* Left Column: Visual Banner & Event Metadata */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 aspect-[16/10] group">
                  <img
                    src={activeRecent.image}
                    alt={activeRecent.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-[#202124] border border-neutral-200 backdrop-blur-md shadow-xs">
                      {activeRecent.category} • {activeRecent.type}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Concluded Milestone</span>
                    </span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 border border-neutral-200 backdrop-blur-md flex items-center justify-between gap-3 text-xs text-[#3C4043] shadow-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1A73E8]" />
                      <span className="font-semibold text-[#202124]">{activeRecent.displayDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#5F6368]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[180px]">{activeRecent.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Mini Gallery Previews strip */}
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Campus Event Photo Archive available</span>
                  </div>
                  <Link
                    to="/gallery"
                    className="text-xs font-semibold text-[#1A73E8] hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Open Gallery</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Outcomes, Highlights & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#202124] tracking-tight">
                    {activeRecent.title}
                  </h3>
                  <p className="text-sm text-[#5F6368] mt-2 leading-relaxed">
                    {activeRecent.shortDescription}
                  </p>
                </div>

                {/* Event Key Outcomes (Metrics) */}
                {activeRecent.outcomes && activeRecent.outcomes.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeRecent.outcomes.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center"
                      >
                        <span className="text-xl sm:text-2xl font-extrabold font-mono block text-[#1E8E3E]">
                          {item.metric}
                        </span>
                        <span className="text-[11px] font-medium text-[#5F6368] block mt-0.5">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights Bullet List */}
                {activeRecent.highlights && activeRecent.highlights.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#5F6368] block font-semibold">
                      Key Highlights &amp; Takeaways
                    </span>
                    <ul className="space-y-2 text-xs text-[#3C4043]">
                      {activeRecent.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Session Speakers */}
                {activeRecent.speakers && activeRecent.speakers.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#5F6368] block font-semibold mb-2.5">
                      Session Speakers &amp; Mentors
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeRecent.speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs shadow-2xs"
                        >
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-[#202124]">{speaker.name}</span>
                          <span className="text-[10px] text-[#5F6368] hidden sm:inline">
                            ({speaker.role.split("•")[0].trim()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
                  <Link
                    to={`/events/${activeRecent.slug}`}
                    id="recent-event-read-recap-btn"
                    className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-2"
                  >
                    <span>Explore Full Recap &amp; Talks</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/past-events"
                    className="py-3 px-5 rounded-xl font-semibold text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors shadow-2xs"
                  >
                    Browse Past Events Archive
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: SMART EVENT DISCOVERY */}
      <SmartDiscovery events={[...upcomingEvents, ...pastEvents]} onOpenRSVP={onOpenRSVP} />

      {/* SECTION: UPCOMING EVENTS SCHEDULE */}
      <section id="upcoming-events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
              Upcoming Events &amp; Workshops
            </h2>
            <p className="text-sm text-[#5F6368] mt-1">
              Reserve your seat for upcoming workshops, study jams, and sprints on FIEM campus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              id="home-register-new-event-btn"
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register New Event</span>
            </button>

            <Link
              to="/upcoming-events"
              id="view-all-upcoming-btn"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A73E8] hover:underline transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} onOpenRSVP={onOpenRSVP} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl">
            <p className="text-[#5F6368] text-sm">No upcoming events currently scheduled. Check back soon!</p>
          </div>
        )}

        {/* Register Event Modal */}
        <RegisterEventModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onEventCreated={() => {
            eventService.getUpcomingEvents().then(setUpcomingEvents);
          }}
        />
      </section>

      {/* SECTION: COMMUNITY IMPACT & HIGHLIGHTS */}
      <section id="community-stats-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DADCE0] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
          <div className="max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-semibold block mb-2">
              Community Impact
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
              Empowering Student Developers at FIEM
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] mt-2">
              Real participation, student project demos, and technical growth across departments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-blue-300 transition-colors">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block text-[#1A73E8]">
                18+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#202124] mt-1 block">
                Technical Workshops
              </span>
              <span className="text-[11px] text-[#5F6368] mt-0.5 block">Labs, Jams &amp; Bootcamps</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-red-300 transition-colors">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block text-[#EA4335]">
                1,200+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#202124] mt-1 block">
                Community Reach
              </span>
              <span className="text-[11px] text-[#5F6368] mt-0.5 block">FIEM Students &amp; Alumni</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-amber-300 transition-colors">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block text-[#F9AB00]">
                45+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#202124] mt-1 block">
                Student Projects
              </span>
              <span className="text-[11px] text-[#5F6368] mt-0.5 block">Open Source &amp; Challenge</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-300 transition-colors">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block text-[#1E8E3E]">
                100%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#202124] mt-1 block">
                Free Student Access
              </span>
              <span className="text-[11px] text-[#5F6368] mt-0.5 block">Community Driven</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: VOICES OF FIEM DEVELOPERS (STUDENT TESTIMONIALS) */}
      <section id="student-testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] mb-3 shadow-2xs">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Student Community Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
            Built by Students, For Students
          </h2>
          <p className="text-sm text-[#5F6368] mt-2">
            Hear from FIEM developers who attended our workshops, built projects, and leveled up their skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentTestimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#DADCE0] rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-300 transition-all hover:-translate-y-1 shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                    {item.badge}
                  </span>
                  <GoogleDots />
                </div>
                <p className="text-sm text-[#3C4043] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-neutral-100">
                <div className="font-bold text-sm text-[#202124]">{item.name}</div>
                <div className="text-xs text-[#5F6368] mt-0.5">{item.dept}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: QUICK FAQ ACCORDION */}
      <section id="home-faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
            Quick answers to common questions regarding participation, RSVP passes, and joining the chapter.
          </p>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#DADCE0] rounded-2xl overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none hover:bg-neutral-50/70 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#202124]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5F6368] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1A73E8]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5F6368] leading-relaxed border-t border-neutral-100 bg-neutral-50/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A73E8] hover:underline transition-colors"
          >
            <span>View Full FAQ Knowledgebase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section id="final-cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 border border-[#DADCE0] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          {/* Subtle Google accent bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
            Ready to Build Something Real?
          </h3>
          <p className="text-sm sm:text-base text-[#5F6368] max-w-xl mx-auto mt-2 leading-relaxed">
            Join the GDG on Campus FIEM community. Attend technical bootcamps, connect with peers, and level up your engineering career.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              id="cta-rsvp-now-btn"
              onClick={() => onOpenRSVP(featuredEvent?.id)}
              className="py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <span>RSVP for Upcoming Event</span>
            </button>

            <Link
              to="/connect"
              id="cta-connect-btn"
              className="py-3.5 px-6 rounded-xl font-semibold text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors shadow-2xs"
            >
              Connect with Organizers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
