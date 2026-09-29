import { useState } from "react";
import { CheckSquare, Square, Share2, Check, Clock, Sparkles } from "lucide-react";
import { AgendaItem } from "../types";

interface PersonalizedPlanProps {
  agenda: AgendaItem[];
  eventTitle: string;
}

export function PersonalizedPlan({ agenda, eventTitle }: PersonalizedPlanProps) {
  // By default all sessions selected
  const [selectedIds, setSelectedIds] = useState<string[]>(agenda.map((a) => a.id));
  const [copied, setCopied] = useState(false);

  const toggleSession = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSessions = agenda.filter((a) => selectedIds.includes(a.id));

  const handleCopyPlan = () => {
    const text = `My GDG FIEM Day Plan for ${eventTitle}:\n` +
      selectedSessions
        .map((s) => `• ${s.time} — ${s.title}${s.speakerName ? ` (with ${s.speakerName})` : ""}`)
        .join("\n") +
      `\n\nOrganized by GDG on Campus FIEM`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div id="personalized-event-plan" className="bg-white border border-[#DADCE0] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#137333] border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Interactive Plan Builder</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
            Your Event Plan
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Personalize your day: toggle sessions you plan to attend and export your customized schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyPlan}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-[#202124] bg-white hover:bg-neutral-50 border border-[#DADCE0] transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-[#34A853]" /> : <Share2 className="w-4 h-4 text-[#1A73E8]" />}
          <span>{copied ? "Plan Copied to Clipboard!" : "Copy My Schedule"}</span>
        </button>
      </div>

      <div className="space-y-2.5 mb-6">
        {agenda.map((item) => {
          const isChecked = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSession(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isChecked
                  ? "bg-blue-50/50 border-[#1A73E8]/40 text-[#202124]"
                  : "bg-neutral-50/60 border-neutral-200 text-[#80868B] line-through opacity-70"
              }`}
            >
              <button
                type="button"
                aria-label={isChecked ? `Deselect ${item.title}` : `Select ${item.title}`}
                className="mt-0.5 text-[#1A73E8] shrink-0 cursor-pointer"
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-[#1A73E8]" />
                ) : (
                  <Square className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-[#3C4043] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FBBC04]" />
                    {item.time}
                  </span>
                  {item.duration && (
                    <span className="text-[11px] text-[#5F6368] font-mono">({item.duration})</span>
                  )}
                  {item.tag && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#5F6368] border border-[#DADCE0]">
                      {item.tag}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold mt-1 truncate text-[#202124]">{item.title}</h4>
                {item.speakerName && (
                  <p className="text-xs text-[#5F6368] mt-0.5">By {item.speakerName}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#DADCE0] flex items-center justify-between text-xs text-[#5F6368] font-mono">
        <span>Selected: {selectedSessions.length} of {agenda.length} sessions</span>
        <span className="text-[#1A73E8] font-semibold">Estimated on-campus time: ~5.5 hours</span>
      </div>
    </div>
  );
}
