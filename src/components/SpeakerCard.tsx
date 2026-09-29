import { Linkedin, Twitter, Github, ExternalLink } from "lucide-react";
import { Speaker } from "../types";

interface SpeakerCardProps {
  speaker: Speaker;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <div
      id={`speaker-card-${speaker.id}`}
      className="bg-white border border-[#DADCE0] hover:border-neutral-300 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={speaker.avatar}
              alt={speaker.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-neutral-200 group-hover:border-[#1A73E8] transition-colors shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1A73E8] border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-[#202124] group-hover:text-[#1A73E8] transition-colors truncate">
              {speaker.name}
            </h4>
            <p className="text-xs sm:text-sm font-medium text-[#1A73E8] truncate">
              {speaker.role}
            </p>
            <p className="text-xs text-[#5F6368] truncate mt-0.5 font-mono">
              {speaker.organization}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#5F6368] line-clamp-3 leading-relaxed mb-4">
          {speaker.bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="pt-3 border-t border-neutral-100 flex items-center gap-3">
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${speaker.name} LinkedIn profile`}
            className="p-1.5 rounded-lg text-[#5F6368] hover:text-[#0A66C2] hover:bg-neutral-100 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {speaker.github && (
          <a
            href={speaker.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${speaker.name} GitHub profile`}
            className="p-1.5 rounded-lg text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {speaker.twitter && (
          <a
            href={speaker.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label={`${speaker.name} Twitter profile`}
            className="p-1.5 rounded-lg text-[#5F6368] hover:text-[#1DA1F2] hover:bg-neutral-100 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        )}
        <span className="text-[11px] text-[#70757A] ml-auto flex items-center gap-1 font-mono">
          Featured Speaker
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
