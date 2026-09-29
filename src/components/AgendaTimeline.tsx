import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, User, Tag, CheckCircle } from "lucide-react";
import { AgendaItem } from "../types";

interface AgendaTimelineProps {
  agenda: AgendaItem[];
  interactive?: boolean;
}

export function AgendaTimeline({ agenda, interactive = true }: AgendaTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(agenda[0]?.id || null);

  const toggleExpand = (id: string) => {
    if (!interactive) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="agenda-timeline" className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-[11px] sm:before:left-[15px] before:w-0.5 before:bg-gradient-to-b before:from-[#4285F4] before:via-[#FBBC04] before:to-[#34A853]">
      {agenda.map((item, index) => {
        const isExpanded = expandedId === item.id;

        // Custom badge styling based on tag
        const getTagColor = (tag?: string) => {
          if (!tag) return "bg-neutral-100 text-[#3C4043]";
          if (tag.includes("Workshop") || tag.includes("Technical")) return "bg-blue-50 text-[#1A73E8] border-blue-200";
          if (tag.includes("Challenge") || tag.includes("Hack")) return "bg-purple-50 text-purple-700 border-purple-200";
          if (tag.includes("Keynote")) return "bg-amber-50 text-amber-800 border-amber-200";
          if (tag.includes("Networking") || tag.includes("Lunch")) return "bg-emerald-50 text-emerald-800 border-emerald-200";
          return "bg-neutral-100 text-[#5F6368] border-neutral-200";
        };

        return (
          <div
            key={item.id}
            id={`timeline-item-${item.id}`}
            className="relative group cursor-pointer"
            onClick={() => toggleExpand(item.id)}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[30px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                isExpanded
                  ? "bg-[#1A73E8] border-white text-white shadow-xs"
                  : "bg-white border-neutral-300 text-[#5F6368] group-hover:border-[#1A73E8]"
              }`}
            >
              <span className="text-[10px] font-mono font-bold">{index + 1}</span>
            </div>

            {/* Session Card */}
            <div
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
                isExpanded
                  ? "bg-white border-blue-400 shadow-sm ring-1 ring-blue-200"
                  : "bg-white border-[#DADCE0] hover:border-neutral-300 shadow-2xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-[#1A73E8] border border-blue-200 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#1A73E8]" />
                    {item.time}
                  </span>

                  {item.duration && (
                    <span className="text-[11px] text-[#5F6368] font-mono">
                      ({item.duration})
                    </span>
                  )}

                  {item.tag && (
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTagColor(item.tag)}`}>
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                  <span className="hidden sm:inline-block">
                    {isExpanded ? "Collapse" : "Click to expand details"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#3C4043]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5F6368] group-hover:text-[#202124]" />
                  )}
                </div>
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-bold text-[#202124] mt-2 group-hover:text-[#1A73E8] transition-colors">
                {item.title}
              </h4>

              {/* Speaker Preview */}
              {item.speakerName && (
                <div className="flex items-center gap-1.5 text-xs text-[#5F6368] mt-1">
                  <User className="w-3.5 h-3.5 text-[#80868B]" />
                  <span className="font-medium text-[#3C4043]">
                    Speaker: {item.speakerName}
                  </span>
                </div>
              )}

              {/* Expandable Content */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-neutral-100 text-sm text-[#5F6368] space-y-3 animate-in fade-in duration-200">
                  <p className="leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F6368] pt-1">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Interactive session with live Q&amp;A</span>
                    </div>
                    {item.tag && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-[#80868B]" />
                        <span>Track: {item.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
