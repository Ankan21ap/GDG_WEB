import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Layers,
  ArrowRight,
  Sparkles,
  Terminal,
  Activity,
  UserCheck,
  Calendar,
  Ticket,
  FileCode,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { GoogleDots } from "../components/GoogleColorsBar";
import {
  REGISTRATION_MODEL_META,
  EVENT_MODEL_META,
  MONGOOSE_RSVP_CODE,
  MONGOOSE_EVENT_CODE,
  EXPRESS_RSVP_ROUTE_CODE,
  EXPRESS_EVENT_ROUTE_CODE,
  validateRegistrationAgainstSchema,
  ValidationErrorResult,
} from "../models/schemaDefinitions";
import { registrationService } from "../services/registrationService";
import { getUpcomingEvents, allEvents } from "../data/events";
import { Registration, Event } from "../types";

interface ModelsPageProps {
  onOpenRSVP: (eventId?: string) => void;
}

export function ModelsPage({ onOpenRSVP }: ModelsPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "code" | "validator" | "query" | "documents"
  >("overview");

  const [selectedModel, setSelectedModel] = useState<"rsvp" | "event">("rsvp");
  const [selectedCodeFile, setSelectedCodeFile] = useState<
    "rsvp.js" | "event.js" | "routes/rsvp.js" | "routes/event.js"
  >("rsvp.js");

  const [copied, setCopied] = useState(false);

  // Live validator state
  const upcomingEvents = getUpcomingEvents();
  const [validatorForm, setValidatorForm] = useState({
    eventId: upcomingEvents[0]?.id || "genai-hack-2025",
    fullName: "Sourav Ganguly",
    email: "sourav.g@fiem.edu.in",
    phone: "9831098765",
    college: "Future Institute of Engineering and Management",
    department: "Computer Science & Engineering",
    yearOfStudy: "3rd Year",
  });

  const [validationResult, setValidationResult] =
    useState<ValidationErrorResult | null>(() =>
      validateRegistrationAgainstSchema(validatorForm)
    );

  // Live documents state from registration service
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    registrationService.getRegistrations()
  );

  // Query console state
  const [queryMode, setQueryMode] = useState<
    "all" | "confirmed" | "checked_in" | "populated" | "aggregate"
  >("populated");

  const refreshRegistrations = () => {
    setRegistrations(registrationService.getRegistrations());
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidatorChange = (field: string, value: string) => {
    const updated = { ...validatorForm, [field]: value };
    setValidatorForm(updated);
    setValidationResult(validateRegistrationAgainstSchema(updated));
  };

  const handleToggleCheckIn = (id: string) => {
    registrationService.toggleCheckIn(id);
    refreshRegistrations();
  };

  // Format Query Output
  const queryOutput = useMemo(() => {
    switch (queryMode) {
      case "all":
        return JSON.stringify(
          registrations.map((r) => ({
            _id: r._id || `ObjectId("${r.id}")`,
            eventId: `ObjectId("${r.eventId}")`,
            registrationId: r.registrationId || r.id,
            fullName: r.fullName || r.name,
            email: r.email,
            phone: r.phone,
            college: r.college,
            yearOfStudy: r.yearOfStudy || r.year,
            status: r.status || "confirmed",
            checkedIn: !!r.checkedIn,
            createdAt: r.createdAt || r.registeredAt,
          })),
          null,
          2
        );

      case "confirmed":
        return JSON.stringify(
          registrations
            .filter((r) => !r.checkedIn)
            .map((r) => ({
              _id: r._id || `ObjectId("${r.id}")`,
              registrationId: r.registrationId || r.id,
              fullName: r.fullName || r.name,
              email: r.email,
              phone: r.phone,
              status: "confirmed",
              checkedIn: false,
            })),
          null,
          2
        );

      case "checked_in":
        return JSON.stringify(
          registrations
            .filter((r) => r.checkedIn)
            .map((r) => ({
              _id: r._id || `ObjectId("${r.id}")`,
              registrationId: r.registrationId || r.id,
              fullName: r.fullName || r.name,
              status: "checked_in",
              checkedIn: true,
              checkedInAt: r.checkedInAt,
            })),
          null,
          2
        );

      case "populated":
        return JSON.stringify(
          registrations.slice(0, 2).map((r) => {
            const matchedEvt = allEvents.find((e: Event) => e.id === r.eventId);
            return {
              _id: r._id || "66f120194e3e49a1b601a09f",
              registrationId: r.registrationId || r.id,
              fullName: r.fullName || r.name,
              email: r.email,
              phone: r.phone,
              college: r.college,
              yearOfStudy: r.yearOfStudy || r.year,
              // Populated Event reference
              eventId: matchedEvt
                ? {
                    _id: `ObjectId("${matchedEvt.id}")`,
                    title: matchedEvt.title,
                    slug: matchedEvt.slug,
                    type: matchedEvt.type,
                    category: matchedEvt.category,
                    venue: matchedEvt.venue,
                    displayDate: matchedEvt.displayDate,
                    seatsRemaining: matchedEvt.seatsRemaining,
                  }
                : `ObjectId("${r.eventId}")`,
              status: r.status || "confirmed",
              checkedIn: !!r.checkedIn,
              createdAt: r.createdAt || r.registeredAt,
              __v: 0,
            };
          }),
          null,
          2
        );

      case "aggregate":
        // Group by event
        const counts: Record<string, number> = {};
        registrations.forEach((r) => {
          counts[r.eventId] = (counts[r.eventId] || 0) + 1;
        });
        return JSON.stringify(
          Object.entries(counts).map(([evtId, total]) => {
            const evt = allEvents.find((e: Event) => e.id === evtId);
            return {
              _id: evtId,
              eventTitle: evt?.title || evtId,
              totalRegistrations: total,
              capacity: evt?.totalSeats || 120,
              fillRatePercentage: `${Math.round((total / (evt?.totalSeats || 120)) * 100)}%`,
            };
          }),
          null,
          2
        );
    }
  }, [queryMode, registrations, allEvents]);

  const currentCode = useMemo(() => {
    switch (selectedCodeFile) {
      case "rsvp.js":
        return MONGOOSE_RSVP_CODE;
      case "event.js":
        return MONGOOSE_EVENT_CODE;
      case "routes/rsvp.js":
        return EXPRESS_RSVP_ROUTE_CODE;
      case "routes/event.js":
        return EXPRESS_EVENT_ROUTE_CODE;
    }
  }, [selectedCodeFile]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#F8F9FA] text-[#202124]">
      {/* Top Banner / Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DADCE0] text-xs font-mono text-[#5F6368] mb-4 shadow-xs">
          <Database className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>MongoDB &amp; Mongoose ODM Architecture</span>
          <GoogleDots />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
              Mongoose Schema &amp; Data Models
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5F6368] max-w-3xl leading-relaxed">
              Production-grade relational schema architecture for{" "}
              <span className="text-[#202124] font-semibold">GDG on Campus FIEM</span>.
              Featuring the <code className="text-[#EA4335] font-mono">Registration (rsvp.js)</code> and{" "}
              <code className="text-[#1A73E8] font-mono">Event (event.js)</code> Mongoose models,
              strict regex/enum validation rules, relational population, and Express REST controllers.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              id="model-page-open-rsvp"
              onClick={() => onOpenRSVP()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Create New RSVP</span>
            </button>

            <Link
              to="/upcoming-events"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#202124] bg-white hover:bg-neutral-100 border border-[#DADCE0] transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#5F6368]" />
              <span>View Events</span>
            </Link>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="p-3 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1A73E8]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#202124]">2 Core Models</div>
              <div className="text-[11px] text-[#5F6368]">Event &amp; Registration</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#137333]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#202124]">Strict Validation</div>
              <div className="text-[11px] text-[#5F6368]">Phone regex &amp; Year enum</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-[#B06000]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#202124]">Relational Linking</div>
              <div className="text-[11px] text-[#5F6368]">ref: &apos;Event&apos; &amp; .populate()</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#202124]">Live Controller</div>
              <div className="text-[11px] text-[#5F6368]">Seat count &amp; Ticket sync</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DADCE0] no-scrollbar">
          {[
            { id: "overview", label: "Architecture & Visual ERD", icon: Layers },
            { id: "code", label: "Mongoose & Route Source Code", icon: Code2 },
            { id: "validator", label: "Schema Validation Sandbox", icon: ShieldCheck },
            { id: "query", label: "Query Simulator (BSON)", icon: Terminal },
            { id: "documents", label: `Live Documents (${registrations.length})`, icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-white text-[#1A73E8] border border-[#DADCE0] shadow-xs"
                    : "text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#1A73E8]" : "text-[#5F6368]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Architecture & Visual ERD */}
      {activeTab === "overview" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
          {/* Visual ERD Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DADCE0] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#202124] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#1A73E8]" />
                  <span>Entity Relationship Diagram (ERD)</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
                  Mongoose ODM relational reference linking Event documents with Registration attendees.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 text-[#3C4043] border border-[#DADCE0]">
                1 : N Relationship
              </span>
            </div>

            {/* Visual Schema Blocks Connected */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-center">
              {/* Event Model Box */}
              <div className="lg:col-span-3 rounded-2xl bg-[#F8F9FA] border-2 border-blue-400 p-5 shadow-sm relative">
                <div className="flex items-center justify-between pb-3 border-b border-[#DADCE0] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]" />
                    <span className="font-mono font-bold text-[#202124] text-sm">Model: Event</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5F6368]">events (event.js)</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-[#3C4043]">
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-neutral-100">
                    <span className="text-[#B06000] font-bold">_id: ObjectId</span>
                    <span className="text-[#5F6368] text-[10px]">PRIMARY KEY</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">title: String</span>
                    <span className="text-[#1A73E8] text-[10px]">required</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">slug: String</span>
                    <span className="text-[#137333] text-[10px]">unique, index</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">type / category</span>
                    <span className="text-purple-600 text-[10px]">enum</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">date: Date</span>
                    <span className="text-[#1A73E8] text-[10px]">index</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">venue / address</span>
                    <span className="text-[#5F6368] text-[10px]">String</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">seatsRemaining</span>
                    <span className="text-[#B06000] text-[10px]">Number (atomic)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-blue-50 border border-blue-200">
                    <span className="text-[#1A73E8] font-semibold">virtual(&apos;registrations&apos;)</span>
                    <span className="text-[#1A73E8] text-[10px]">HasMany</span>
                  </div>
                </div>
              </div>

              {/* Connecting Pipe / Relation Line */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 lg:py-0">
                <div className="hidden lg:flex flex-col items-center">
                  <span className="text-[10px] font-mono text-[#5F6368] bg-neutral-100 px-2 py-0.5 rounded border border-[#DADCE0] mb-1">
                    1 : N
                  </span>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-amber-500" />
                  <ArrowRight className="w-4 h-4 text-[#FBBC04] -ml-1 mt-[-9px]" />
                  <span className="text-[9px] font-mono text-[#5F6368] mt-2 text-center">
                    ref: &apos;Event&apos;
                  </span>
                </div>
                <div className="lg:hidden flex items-center justify-center gap-2 py-2">
                  <span className="text-xs font-mono text-[#5F6368]">1-to-Many Reference</span>
                  <ArrowRight className="w-4 h-4 text-[#FBBC04]" />
                </div>
              </div>

              {/* Registration Model Box */}
              <div className="lg:col-span-3 rounded-2xl bg-[#F8F9FA] border-2 border-amber-400 p-5 shadow-sm relative">
                <div className="flex items-center justify-between pb-3 border-b border-[#DADCE0] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
                    <span className="font-mono font-bold text-[#202124] text-sm">Model: Registration</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5F6368]">registrations (rsvp.js)</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-[#3C4043]">
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-neutral-100">
                    <span className="text-[#B06000] font-bold">_id: ObjectId</span>
                    <span className="text-[#5F6368] text-[10px]">PRIMARY KEY</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-amber-50 border border-amber-200">
                    <span className="text-[#B06000] font-bold">eventId: ObjectId</span>
                    <span className="text-[#B06000] text-[10px]">ref: &apos;Event&apos;</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">registrationId</span>
                    <span className="text-[#137333] text-[10px]">unique, index</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">fullName: String</span>
                    <span className="text-[#5F6368] text-[10px]">min: 2, max: 100</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">email: String</span>
                    <span className="text-[#1A73E8] text-[10px]">regex, index</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">phone: String</span>
                    <span className="text-[#EA4335] text-[10px]">/^[6-9]\d&#123;9&#125;$/</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">yearOfStudy</span>
                    <span className="text-purple-600 text-[10px]">enum (1st-4th)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-[#202124]">checkedIn: Boolean</span>
                    <span className="text-[#137333] text-[10px]">venue check-in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Catalog Selection */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#5F6368]" />
                <span>Field Dictionary &amp; Schema Specifications</span>
              </h3>

              <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-[#DADCE0]">
                <button
                  type="button"
                  onClick={() => setSelectedModel("rsvp")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedModel === "rsvp"
                      ? "bg-[#1A73E8] text-white shadow-xs"
                      : "text-[#5F6368] hover:text-[#202124]"
                  }`}
                >
                  Registration (rsvp.js)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel("event")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedModel === "event"
                      ? "bg-[#1A73E8] text-white shadow-xs"
                      : "text-[#5F6368] hover:text-[#202124]"
                  }`}
                >
                  Event (event.js)
                </button>
              </div>
            </div>

            {/* Selected Model Detailed Table */}
            {(() => {
              const meta =
                selectedModel === "rsvp" ? REGISTRATION_MODEL_META : EVENT_MODEL_META;
              return (
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base sm:text-lg">
                          {meta.name} Model
                        </span>
                        <code className="text-xs px-2 py-0.5 rounded bg-neutral-800 font-mono text-neutral-300">
                          {meta.filename}
                        </code>
                        <span className="text-xs text-neutral-500 font-mono">
                          collection: &apos;{meta.collection}&apos;
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{meta.description}</p>
                    </div>

                    <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700">
                        {meta.fields.length} schema fields
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-3.5 pl-5">Field Name</th>
                          <th className="p-3.5">BSON Type</th>
                          <th className="p-3.5">Attributes</th>
                          <th className="p-3.5">Validation Rules / Constraints</th>
                          <th className="p-3.5 pr-5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 font-mono">
                        {meta.fields.map((f) => (
                          <tr key={f.name} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="p-3.5 pl-5 font-bold text-white flex items-center gap-1.5">
                              <span>{f.name}</span>
                              {f.required && (
                                <span className="text-red-400 text-xs" title="Required field">
                                  *
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-blue-400">{f.type}</td>
                            <td className="p-3.5 space-x-1">
                              {f.required && (
                                <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 text-[10px]">
                                  required
                                </span>
                              )}
                              {f.unique && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[10px]">
                                  unique
                                </span>
                              )}
                              {f.indexed && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 text-[10px]">
                                  index
                                </span>
                              )}
                              {f.ref && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px]">
                                  ref: {f.ref}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-neutral-300 max-w-xs truncate">
                              {f.validation ? (
                                <span className="text-amber-300">{f.validation}</span>
                              ) : f.enumValues ? (
                                <span className="text-purple-300">
                                  [{f.enumValues.slice(0, 3).join(", ")}
                                  {f.enumValues.length > 3 ? "..." : ""}]
                                </span>
                              ) : f.default ? (
                                <span className="text-neutral-400">default: {f.default}</span>
                              ) : (
                                <span className="text-neutral-600">—</span>
                              )}
                            </td>
                            <td className="p-3.5 pr-5 text-neutral-400 font-sans text-xs">
                              {f.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 2: Code Viewer */}
      {activeTab === "code" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* File Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "rsvp.js", label: "server/models/rsvp.js", type: "Model" },
                { id: "event.js", label: "server/models/event.js", type: "Model" },
                { id: "routes/rsvp.js", label: "server/routes/rsvp.js", type: "Route" },
                { id: "routes/event.js", label: "server/routes/event.js", type: "Route" },
              ].map((f) => {
                const active = selectedCodeFile === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedCodeFile(f.id as any)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                        : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800"
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 ${active ? "text-amber-400" : "text-neutral-500"}`} />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Copy Action */}
            <button
              type="button"
              onClick={() => handleCopyCode(currentCode)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Source Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-xs text-neutral-400 ml-2">
                  {selectedCodeFile}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                ESM · Node.js · Mongoose ODM
              </span>
            </div>

            <pre className="p-5 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed max-h-[600px] selection:bg-blue-600/40">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Schema Validation Sandbox */}
      {activeTab === "validator" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Schema Constraint Validator</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Simulates client &amp; server execution of Mongoose validators. Type invalid values below
              to see Mongoose <code className="text-red-400 font-mono">ValidationError</code> thrown
              instantly (e.g., test a phone number not starting with 6-9 or shorter than 10 digits).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Input Form */}
            <div className="lg:col-span-6 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Input Payload
              </h3>

              {/* Event ID */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Target Event (eventId) *
                </label>
                <select
                  value={validatorForm.eventId}
                  onChange={(e) => handleValidatorChange("eventId", e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                >
                  {upcomingEvents.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.id})
                    </option>
                  ))}
                  <option value="">[Empty / Missing eventId - Triggers required error]</option>
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Full Name (fullName) *
                </label>
                <input
                  type="text"
                  value={validatorForm.fullName}
                  onChange={(e) => handleValidatorChange("fullName", e.target.value)}
                  placeholder="Min 2 characters"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Email Address (email) *
                </label>
                <input
                  type="email"
                  value={validatorForm.email}
                  onChange={(e) => handleValidatorChange("email", e.target.value)}
                  placeholder="regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Phone Number (phone) *
                  </label>
                  <span className="text-[10px] font-mono text-amber-400">
                    Regex: /^[6-9]\d&#123;9&#125;$/
                  </span>
                </div>
                <input
                  type="text"
                  value={validatorForm.phone}
                  onChange={(e) => handleValidatorChange("phone", e.target.value)}
                  placeholder="e.g. 9831098765"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* College */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  College (college) *
                </label>
                <input
                  type="text"
                  value={validatorForm.college}
                  onChange={(e) => handleValidatorChange("college", e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Year of Study Enum */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Year of Study (yearOfStudy enum) *
                </label>
                <select
                  value={validatorForm.yearOfStudy}
                  onChange={(e) => handleValidatorChange("yearOfStudy", e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Alumni / Professional">Alumni / Professional</option>
                  <option value="Invalid Year 99">[Invalid Enum Value for test]</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setValidatorForm({
                      eventId: upcomingEvents[0]?.id || "genai-hack-2025",
                      fullName: "Anirban Bhattacharya",
                      email: "anirban.b@fiem.edu.in",
                      phone: "9876543210",
                      college: "Future Institute of Engineering and Management",
                      department: "CSE (AI & ML)",
                      yearOfStudy: "3rd Year",
                    });
                    setValidationResult(
                      validateRegistrationAgainstSchema({
                        eventId: upcomingEvents[0]?.id || "genai-hack-2025",
                        fullName: "Anirban Bhattacharya",
                        email: "anirban.b@fiem.edu.in",
                        phone: "9876543210",
                        college: "Future Institute of Engineering and Management",
                        department: "CSE (AI & ML)",
                        yearOfStudy: "3rd Year",
                      })
                    );
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
                >
                  Reset with valid demo values
                </button>
              </div>
            </div>

            {/* Live Validator Diagnostics / Output */}
            <div className="lg:col-span-6 space-y-4">
              <div
                className={`rounded-2xl border p-5 transition-all ${
                  validationResult?.valid
                    ? "bg-emerald-950/20 border-emerald-800/80"
                    : "bg-red-950/20 border-red-800/80"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {validationResult?.valid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm text-emerald-300">
                        Schema Validation Passed
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-sm text-red-300">
                        Mongoose ValidationError ({Object.keys(validationResult?.errors || {}).length} errors)
                      </span>
                    </>
                  )}
                </div>

                {validationResult?.valid ? (
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    All document properties satisfy Mongoose schema rules. This document is ready
                    to be saved into MongoDB via <code className="text-emerald-400">await registration.save()</code>.
                  </p>
                ) : (
                  <div className="space-y-2 mt-3">
                    {Object.entries(validationResult?.errors || {}).map(([field, msg]) => (
                      <div
                        key={field}
                        className="p-2.5 rounded-xl bg-red-950/50 border border-red-800/60 font-mono text-xs text-red-200 flex items-start gap-2"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-red-900 text-white text-[10px] font-bold uppercase">
                          {field}
                        </span>
                        <span className="flex-1">{msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document BSON Preview */}
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Calculated BSON Document Payload</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">MongoDB Output</span>
                </div>

                <pre className="font-mono text-xs text-neutral-300 overflow-x-auto p-2 bg-neutral-950 rounded-xl max-h-64">
                  {JSON.stringify(
                    {
                      _id: 'ObjectId("66f122094e3e49a1b601a0cf")',
                      eventId: `ObjectId("${validatorForm.eventId}")`,
                      registrationId: "GDG-FIEM-X92KV",
                      fullName: validatorForm.fullName,
                      email: validatorForm.email.toLowerCase(),
                      phone: validatorForm.phone,
                      college: validatorForm.college,
                      department: validatorForm.department,
                      yearOfStudy: validatorForm.yearOfStudy,
                      status: "confirmed",
                      checkedIn: false,
                      checkedInAt: null,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      __v: 0,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Query Simulator (BSON) */}
      {activeTab === "query" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Mongoose Query Simulator</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                Execute queries against the real registered attendees in memory, simulating Mongoose
                methods such as <code className="text-amber-400 font-mono">.populate(&apos;eventId&apos;)</code>,{" "}
                <code className="text-blue-400 font-mono">.find()</code>, and{" "}
                <code className="text-purple-400 font-mono">.aggregate()</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshRegistrations}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white border border-neutral-700 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Store</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              {
                id: "populated",
                label: "Registration.find().populate('eventId')",
                desc: "Relational join",
              },
              {
                id: "all",
                label: "Registration.find({})",
                desc: "All attendees",
              },
              {
                id: "confirmed",
                label: "Registration.find({ checkedIn: false })",
                desc: "Pending check-ins",
              },
              {
                id: "checked_in",
                label: "Registration.find({ checkedIn: true })",
                desc: "Venue attendees",
              },
              {
                id: "aggregate",
                label: "Registration.aggregate([ { $group } ])",
                desc: "Counts by Event",
              },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setQueryMode(btn.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all text-left whitespace-nowrap cursor-pointer ${
                  queryMode === btn.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850 border border-neutral-800"
                }`}
              >
                <div className="font-semibold">{btn.label}</div>
                <div className="text-[10px] opacity-80">{btn.desc}</div>
              </button>
            ))}
          </div>

          {/* Query Terminal Box */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs text-neutral-300">
                  mongosh / GDG_FIEM_PROD &gt; {queryMode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(queryOutput)}
                className="text-xs font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </button>
            </div>

            <pre className="p-5 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{queryOutput}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Live Registered Documents */}
      {activeTab === "documents" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span>Live MongoDB Documents in Memory ({registrations.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                These documents are created and updated in real-time by the RSVP modal and venue
                check-in desk. Click &apos;Toggle Venue Check-In&apos; to mutate the document
                (<code className="text-emerald-400 font-mono">PATCH /api/rsvp/:id/checkin</code>).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenRSVP()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Registration</span>
              </button>

              <button
                type="button"
                onClick={refreshRegistrations}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer"
                title="Refresh registrations"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-5">Ticket ID / _id</th>
                    <th className="p-3.5">Attendee</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Target Event (eventId)</th>
                    <th className="p-3.5">Academic</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Venue Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-amber-300">{reg.registrationId || reg.id}</div>
                        <div className="text-[10px] text-neutral-500">
                          {reg._id || "ObjectId('...')"}
                        </div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-white text-xs">{reg.fullName || reg.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{reg.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-neutral-300">
                        <div>{reg.phone}</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <div className="font-medium text-white max-w-xs truncate">{reg.eventTitle}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">ID: {reg.eventId}</div>
                      </td>
                      <td className="p-3.5 font-sans text-neutral-300">
                        <div className="text-xs truncate max-w-xs">{reg.college}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {reg.yearOfStudy || reg.year} · {reg.department || "Tech"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        {reg.checkedIn ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold">
                            <Check className="w-3 h-3" /> Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[10px] font-bold">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 pr-5 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(reg.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            reg.checkedIn
                              ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                              : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                          }`}
                        >
                          {reg.checkedIn ? "Undo Check-In" : "Scan Check-In"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
