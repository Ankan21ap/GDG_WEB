import { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ChevronUp, ChevronDown, Check, RefreshCw, AlertTriangle, UserCheck, Database } from "lucide-react";
import { registrationService } from "../services/registrationService";

interface InterviewDemoHelperProps {
  onOpenRSVP: (eventId?: string) => void;
  onRefreshData?: () => void;
}

export function InterviewDemoHelper({ onOpenRSVP, onRefreshData }: InterviewDemoHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverErrorSim, setServerErrorSim] = useState(registrationService.isSimulateServerError());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleServerError = () => {
    const next = !serverErrorSim;
    setServerErrorSim(next);
    registrationService.setSimulateServerError(next);
    showToast(next ? "Server 500 Simulation ON (Next RSVP will fail)" : "Server 500 Simulation OFF");
  };

  const handleClearRegistrations = () => {
    registrationService.clearAllRegistrations();
    showToast("Cleared all stored registrations from localStorage");
    if (onRefreshData) onRefreshData();
  };

  const registrationCount = registrationService.getRegistrations().length;

  return (
    <aside
      id="interview-demo-helper-bar"
      aria-label="Interview Tech Controls"
      className="fixed bottom-4 right-4 z-40 max-w-xs sm:max-w-sm"
    >
      {toastMsg && (
        <div className="mb-2 p-2.5 bg-neutral-900 border border-blue-500/60 rounded-xl text-xs text-blue-300 shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Helper Header Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Tech Interview Demo Controls</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[10px] font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-700">
              {registrationCount} pass{registrationCount === 1 ? "" : "es"}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Actions */}
        {isOpen && (
          <div className="p-3.5 space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 bg-neutral-950/90">
            <p className="text-[11px] text-neutral-400 leading-tight">
              Instant shortcuts to showcase error states, duplicate prevention, and pass validation during evaluation.
            </p>

            <div className="space-y-1.5 pt-1">
              <Link
                to="/models"
                onClick={() => setIsOpen(false)}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 hover:text-amber-200 border border-neutral-800 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mongoose Models &amp; ERD</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">/models</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  onOpenRSVP("evt-ai-build-day-2026");
                }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Launch RSVP Flow</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Modal</span>
              </button>

              <button
                type="button"
                onClick={handleToggleServerError}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                  serverErrorSim
                    ? "bg-red-950/60 border-red-700 text-red-200"
                    : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${serverErrorSim ? "text-red-400" : "text-amber-400"}`} />
                  <span>Simulate Server 500 Error</span>
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {serverErrorSim ? "ACTIVE" : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleClearRegistrations}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-300 border border-neutral-800 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Reset Local Registrations</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Clear</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
