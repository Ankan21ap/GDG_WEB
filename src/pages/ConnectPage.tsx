import { useState } from "react";
import { 
  Users, 
  Mail, 
  Send, 
  ExternalLink, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Linkedin, 
  Github, 
  Instagram, 
  Twitter, 
  Globe 
} from "lucide-react";
import { GoogleColorsBar, GoogleDots } from "../components/GoogleColorsBar";
import { GDGLogo } from "../components/GDGLogo";

export function ConnectPage() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("General Inquiry");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormName("");
      setFormEmail("");
      setFormMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  const socialChannels = [
    {
      name: "Google Developer Groups Platform",
      handle: "gdg.community.dev/gdg-on-campus-fiem",
      url: "https://gdg.community.dev",
      icon: Globe,
      desc: "Join our official chapter on the global GDG directory to get event announcements directly from Google.",
      color: "border-blue-200 text-[#1A73E8] bg-blue-50",
      cta: "Join Chapter"
    },
    {
      name: "LinkedIn",
      handle: "linkedin.com/company/gdg-on-campus-fiem",
      url: "https://linkedin.com",
      icon: Linkedin,
      desc: "Follow professional updates, speaker announcements, and student achievement spotlights.",
      color: "border-sky-200 text-[#0A66C2] bg-sky-50",
      cta: "Follow on LinkedIn"
    },
    {
      name: "GitHub Organization",
      handle: "github.com/gdg-fiem",
      url: "https://github.com",
      icon: Github,
      desc: "Access event repositories, starter templates, hackathon submissions, and community open-source tools.",
      color: "border-purple-200 text-purple-700 bg-purple-50",
      cta: "Star & Fork Repos"
    },
    {
      name: "Discord Developer Server",
      handle: "discord.gg/gdgfiem",
      url: "https://discord.com",
      icon: MessageSquare,
      desc: "Chat with fellow campus builders, ask technical questions, find hackathon teammates, and get 1-on-1 mentorship.",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
      cta: "Join Discord"
    },
    {
      name: "Instagram",
      handle: "@gdgoncampus.fiem",
      url: "https://instagram.com",
      icon: Instagram,
      desc: "See event recaps, behind-the-scenes organizer preparation, and photo dumps from campus sessions.",
      color: "border-pink-200 text-[#E4405F] bg-pink-50",
      cta: "Follow @gdgoncampus.fiem"
    },
    {
      name: "X / Twitter",
      handle: "@gdg_fiem",
      url: "https://twitter.com",
      icon: Twitter,
      desc: "Get real-time live tweet updates, tech news threads, and live conference commentary.",
      color: "border-neutral-200 text-[#202124] bg-neutral-100",
      cta: "Follow on X"
    }
  ];

  return (
    <div id="connect-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 bg-[#F8F9FA] text-[#202124]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] shadow-2xs">
          <GDGLogo className="w-4 h-4" />
          <span>Stay Connected</span>
          <GoogleDots />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
          Connect With GDG on Campus FIEM
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368]">
          Be part of our thriving developer network. Follow our official channels, join our discussion forums, or contact the student organizing team directly.
        </p>
      </div>

      {/* Official Community Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 border border-[#DADCE0] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xs">
        <GoogleColorsBar className="h-1 absolute top-0 left-0 right-0" />
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono text-[#1A73E8] bg-blue-50 border border-blue-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Chapter Membership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
            Join 1,200+ Student Builders at FIEM
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
            Joining our community is 100% free and open to all departments, years, and skill levels. Receive direct notifications when registration opens for upcoming hackathons, bootcamps, and swag giveaways.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://gdg.community.dev/gdg-on-campus-future-institute-of-engineering-management-kolkata-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 rounded-xl font-semibold text-xs text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Join on Google Developer Groups</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Social and Communication Channels Grid */}
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#202124] tracking-tight">Community Channels</h3>
          <p className="text-sm text-[#5F6368] mt-1">
            Choose your preferred platform to follow technical blogs, event updates, and code repositories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialChannels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div
                key={i}
                className="bg-white border border-[#DADCE0] rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-300 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${channel.color} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#80868B] truncate max-w-[150px]">{channel.handle}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#202124] mb-1.5">{channel.name}</h4>
                  <p className="text-xs text-[#5F6368] leading-relaxed">{channel.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A73E8] hover:underline transition-colors"
                  >
                    <span>{channel.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form & Campus Address */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
              Send a Message to Organizers
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
              Have a suggestion for a workshop, want to speak, or collaborate as a sponsor? Drop us a note!
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received by our lead team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#202124] block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Das"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#202124] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#202124] block mb-1">Subject</label>
              <select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Speaker Proposal">I want to speak at a GDG event</option>
                <option value="Sponsorship & Venue Collaboration">Sponsorship &amp; Collaboration</option>
                <option value="Core Team Recruitment">Core Team Involvement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#202124] block mb-1">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts or proposal here..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
            </button>
          </form>
        </div>

        {/* Campus Location Card */}
        <div className="lg:col-span-5 bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-[#202124] tracking-tight">Campus Headquarters</h3>
            <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
              Future Institute of Engineering and Management (FIEM)
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#3C4043]">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#202124] block">Campus Location</span>
                <span className="text-[#5F6368] mt-0.5 block">
                  Sonarpur Station Road, Mission Pally, Narendrapur, Kolkata, West Bengal 700150
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <Mail className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#202124] block">Community Desk</span>
                <span className="text-[#5F6368] mt-0.5 block font-mono">
                  gdgcampus.fiem@gmail.com
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-[#5F6368] space-y-2">
            <span className="font-bold text-[#202124] block">Note for Visiting Speakers</span>
            <p>
              Campus security requires pre-registration for guest speakers. Our logistics team will coordinate entry badges and parking prior to your session.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
