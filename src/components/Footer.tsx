import { Link } from "react-router-dom";
import { Github, Linkedin, Youtube, Instagram, Mail, ExternalLink, Heart } from "lucide-react";
import { GoogleColorsBar, GoogleDots } from "./GoogleColorsBar";
import { GDGLogo } from "./GDGLogo";

export function Footer() {
  return (
    <footer id="main-footer" className="bg-white border-t border-[#DADCE0] text-[#5F6368] relative">
      <GoogleColorsBar className="h-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <GDGLogo className="w-8 h-8" />
              <span className="font-bold text-lg text-[#202124] tracking-tight">GDG on Campus FIEM</span>
              <GoogleDots />
            </div>

            <p className="text-sm text-[#5F6368] max-w-md leading-relaxed">
              Google Developer Groups on Campus at Future Institute of Engineering and Management (FIEM) Kolkata.
              A peer-to-peer developer community driven to help student developers bridge the gap between academic theory and real-world tech impact.
            </p>

            <div className="text-xs text-[#70757A] flex items-center gap-2 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Independent community initiative supported by Google Developers</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#202124] font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#1A73E8] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/upcoming-events" className="hover:text-[#1A73E8] transition-colors">Upcoming Events</Link>
              </li>
              <li>
                <Link to="/past-events" className="hover:text-[#1A73E8] transition-colors">Past Events</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#1A73E8] transition-colors">Community Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#1A73E8] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#1A73E8] transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/connect" className="hover:text-[#1A73E8] transition-colors">Connect &amp; Channels</Link>
              </li>
            </ul>
          </div>

          {/* Technology Tracks */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#202124] font-bold mb-4">
              Focus Tracks
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-[#3C4043]">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span>Generative AI &amp; Gemini</span>
              </li>
              <li className="flex items-center gap-2 text-[#3C4043]">
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span>Google Cloud &amp; DevOps</span>
              </li>
              <li className="flex items-center gap-2 text-[#3C4043]">
                <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
                <span>Modern Web &amp; React</span>
              </li>
              <li className="flex items-center gap-2 text-[#3C4043]">
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                <span>Android &amp; Flutter</span>
              </li>
              <li className="flex items-center gap-2 text-[#3C4043]">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Solution Challenge</span>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#202124] font-bold mb-4">
              Social Community
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#5F6368] hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#5F6368] hover:text-[#202124] transition-colors"
              >
                <Github className="w-4 h-4 text-[#202124]" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#5F6368] hover:text-[#FF0000] transition-colors"
              >
                <Youtube className="w-4 h-4 text-[#FF0000]" />
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#5F6368] hover:text-[#E4405F] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
              <a
                href="mailto:gdgcampus.fiem@gmail.com"
                className="flex items-center gap-2 text-[#5F6368] hover:text-[#1A73E8] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#1A73E8]" />
                <span>gdgcampus.fiem@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#DADCE0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#70757A]">
          <p>© {new Date().getFullYear()} GDG on Campus FIEM. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>by the GDG on Campus FIEM community.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
