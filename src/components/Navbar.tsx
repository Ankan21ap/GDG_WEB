import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar, ChevronDown, Clock } from "lucide-react";
import { GDGLogo } from "./GDGLogo";
import { GoogleDots } from "./GoogleColorsBar";

interface NavbarProps {
  onOpenRSVP: (eventId?: string) => void;
}

export function Navbar({ onOpenRSVP }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Upcoming Events", path: "/upcoming-events" },
    { label: "Past Events", path: "/past-events" },
    { label: "Gallery", path: "/gallery" },
    { label: "About", path: "/about" },
    { label: "FAQ", path: "/faq" },
    { label: "Connect", path: "/connect" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#DADCE0] py-2.5 shadow-sm"
          : "bg-white/85 backdrop-blur-sm border-b border-neutral-200/80 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Official GDG Logo */}
        <Link
          to="/"
          id="brand-logo-link"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
        >
          <GDGLogo className="w-8 h-8 sm:w-9 sm:h-9" />

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-[#202124] tracking-tight group-hover:text-[#1A73E8] transition-colors">
                GDG on Campus
              </span>
              <GoogleDots />
            </div>
            <span className="text-[11px] font-medium text-[#5F6368] tracking-wider uppercase font-mono">
              FIEM 
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            if (link.label === "Gallery") {
              return (
                <div key={link.path} className="relative group">
                  <Link
                    to={link.path}
                    id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                      active
                        ? "text-[#1A73E8] bg-blue-50/80 font-semibold border border-blue-200/60 shadow-xs"
                        : "text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100/80"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3 h-3 text-[#80868B] group-hover:rotate-180 transition-transform duration-200" />
                    {active && (
                      <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#1A73E8] rounded-full" />
                    )}
                  </Link>

                  {/* Gallery Sub-Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 hidden group-hover:block z-50 min-w-[190px] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white border border-[#DADCE0] rounded-2xl p-1.5 shadow-lg space-y-0.5">
                      <Link
                        to="/gallery?tab=upcoming"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#202124] hover:bg-neutral-50 hover:text-[#1A73E8] transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse shrink-0" />
                        <span>Upcoming Events</span>
                      </Link>
                      <Link
                        to="/gallery?tab=past"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#202124] hover:bg-neutral-50 hover:text-[#1A73E8] transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                        <span>Past Events</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-[#1A73E8] bg-blue-50/80 font-semibold border border-blue-200/60 shadow-xs"
                    : "text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100/80"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#1A73E8] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        {/* <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            id="desktop-rsvp-cta-btn"
            onClick={() => onOpenRSVP()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>RSVP Now</span>
          </button>
        </div> */}

        {/* Mobile Actions: RSVP button + Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            id="mobile-header-rsvp-cta"
            onClick={() => onOpenRSVP()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </button>

          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-2 rounded-lg text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-white/98 border-b border-[#DADCE0] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl shadow-lg"
        >
          <div className="flex flex-col gap-1.5 mb-4">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              if (link.label === "Gallery") {
                return (
                  <div key={link.path} className="space-y-1">
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        active
                          ? "text-[#1A73E8] bg-blue-50 font-semibold border border-blue-200"
                          : "text-[#3C4043] hover:text-[#202124] hover:bg-neutral-100"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />}
                    </Link>
                    <div className="pl-4 ml-3 my-1 flex flex-col gap-1 border-l-2 border-neutral-200">
                      <Link
                        to="/gallery?tab=upcoming"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 px-2 text-xs font-medium text-[#5F6368] hover:text-[#1A73E8] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                        <span>Upcoming Events</span>
                      </Link>
                      <Link
                        to="/gallery?tab=past"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 px-2 text-xs font-medium text-[#5F6368] hover:text-[#1A73E8] flex items-center gap-2"
                      >
                        <Clock className="w-3 h-3 text-[#5F6368]" />
                        <span>Past Events</span>
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    active
                      ? "text-[#1A73E8] bg-blue-50 font-semibold border border-blue-200"
                      : "text-[#3C4043] hover:text-[#202124] hover:bg-neutral-100"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            id="mobile-drawer-full-rsvp-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRSVP();
            }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>RSVP for Upcoming Event</span>
          </button>
        </div>
      )}
    </header>
  );
}
