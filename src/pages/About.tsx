import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  GraduationCap, 
  Code2, 
  Cpu, 
  Layers,
  Check
} from "lucide-react";
import { GoogleColorsBar, GoogleDots } from "../components/GoogleColorsBar";
import { GDGLogo } from "../components/GDGLogo";

export function About() {
  const stats = [
    { number: "18+", label: "Technical Events", note: "Workshops & Jams organized" },
    { number: "25+", label: "Expert Sessions", note: "Delivered by industry guests" },
    { number: "1,200+", label: "Student Members", note: "FIEM active participants" },
    { number: "45+", label: "Open Projects", note: "Campus prototypes & code" },
  ];

  const tracks = [
    {
      name: "Generative AI & Gemini",
      desc: "Prompt engineering, function calling, multimodal workflows, and intelligent agents.",
      icon: Cpu,
      color: "text-[#1A73E8]",
      bg: "bg-blue-50 border-blue-200"
    },
    {
      name: "Cloud & Distributed Systems",
      desc: "Google Cloud Run, serverless microservices, containers, and Kubernetes.",
      icon: Layers,
      color: "text-[#EA4335]",
      bg: "bg-red-50 border-red-200"
    },
    {
      name: "Modern Web & TypeScript",
      desc: "Production-ready architectures with React, Next.js, and edge runtime technologies.",
      icon: Code2,
      color: "text-[#F9AB00]",
      bg: "bg-amber-50 border-amber-200"
    },
    {
      name: "Mobile & Cross-Platform",
      desc: "Declarative UIs using Android Jetpack Compose, Kotlin, and Flutter apps.",
      icon: GraduationCap,
      color: "text-[#1E8E3E]",
      bg: "bg-emerald-50 border-emerald-200"
    }
  ];

  const benefits = [
    "Bridge the gap between academic textbook theory and real-world software engineering",
    "Direct guidance from Google Developer Experts (GDEs) and senior alumni mentors",
    "Gain collaborative experience for hackathons like Google Solution Challenge",
    "Build a demonstrable portfolio of deployed GitHub repositories and open-source pull requests",
    "Grow soft skills: public speaking, team management, technical writing, and peer leadership"
  ];

  return (
    <div id="about-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 bg-[#F8F9FA] text-[#202124]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] shadow-2xs">
          <GDGLogo className="w-4 h-4" />
          <span>About Community</span>
          <GoogleDots />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
          About GDG on Campus FIEM
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368]">
          A vibrant university developer collective at Future Institute of Engineering and Management, Kolkata, supported by Google Developers.
        </p>
      </div>

      {/* Community Statistics Strip */}
      <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <GoogleColorsBar className="h-1 absolute top-0 left-0 right-0" />
        <div className="text-center mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-semibold">
            Chapter Key Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#202124] font-mono block">
                {s.number}
              </span>
              <span className="text-sm font-semibold text-[#202124] mt-1 block">
                {s.label}
              </span>
              <span className="text-[11px] text-[#5F6368] mt-0.5 block">{s.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: What is GDG & GDG on Campus */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1A73E8] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#202124]">What is GDG?</h3>
          <p className="text-sm text-[#5F6368] leading-relaxed">
            Google Developer Groups (GDG) is the largest community network for developers in the world. Developers gather in local city chapters to learn, share insights, discuss emerging technologies, and build solutions around Google and open-source developer platforms.
          </p>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E8E3E] flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#202124]">What is GDG on Campus?</h3>
          <p className="text-sm text-[#5F6368] leading-relaxed">
            GDG on Campus (formerly Google Developer Student Clubs) are university-based community groups tailored directly for students. They provide peer-to-peer learning environments where students grow practical software skills, build solutions for their local communities, and prepare for industry careers.
          </p>
        </div>
      </section>

      {/* Section 2: What does GDG on Campus FIEM do? */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
            What Does GDG on Campus FIEM Do?
          </h2>
          <p className="text-sm text-[#5F6368] mt-1 max-w-2xl">
            At Future Institute of Engineering and Management (Sonarpur, Kolkata), our student chapter organizes hands-on experiences across multiple technical disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <div
                key={i}
                className="bg-white border border-[#DADCE0] rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${track.bg} border flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${track.color}`} />
                </div>
                <h4 className="text-base font-bold text-[#202124]">{track.name}</h4>
                <p className="text-xs text-[#5F6368] leading-relaxed">{track.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Why Students Should Join */}
      <section className="bg-white border border-[#DADCE0] rounded-3xl p-8 sm:p-12 space-y-6 shadow-xs">
        <div className="max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
            Why Should You Join?
          </h3>
          <p className="text-sm text-[#5F6368] mt-2">
            Whether you are writing your first lines of HTML/Python or architecting containerized microservices, GDG on Campus FIEM gives you an environment to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200"
            >
              <Check className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-[#3C4043]">{b}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/upcoming-events"
            className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors shadow-sm"
          >
            Explore Upcoming Events
          </Link>
          <Link
            to="/connect"
            className="py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors shadow-2xs"
          >
            Connect With The Team
          </Link>
        </div>
      </section>

      {/* Note about Official Status */}
      <div className="text-center text-xs text-[#70757A] max-w-xl mx-auto space-y-1">
        <p>GDG on Campus FIEM is an independent university organization supported by Google Developers.</p>
        <p>Google and the Google Developer Groups emblem are trademarks of Google LLC.</p>
      </div>
    </div>
  );
}
