import { useState, useEffect, useMemo } from "react";
import {
  X,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  Phone,
  Ticket,
  Filter,
  Download,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Database,
  Calendar
} from "lucide-react";
import { registrationService } from "../services/registrationService";
import { eventService } from "../services/eventService";
import { Registration, Event } from "../types";
import { QRPass } from "./QRPass";

interface RSVPCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEventId?: string;
}

export function RSVPCandidatesModal({
  isOpen,
  onClose,
  defaultEventId,
}: RSVPCandidatesModalProps) {
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    registrationService.getRegistrations()
  );
  const [events, setEvents] = useState<Event[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string>(
    defaultEventId || "all"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "checked_in">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectCandidate, setInspectCandidate] = useState<Registration | null>(null);

  useEffect(() => {
    if (isOpen) {
      registrationService.fetchRegistrationsFromDb().then(setRegistrations);
      eventService.getAllEvents().then(setEvents);
      if (defaultEventId) {
        setSelectedEventId(defaultEventId);
      }
    }
  }, [isOpen, defaultEventId]);

  if (!isOpen) return null;

  const handleToggleCheckIn = async (id: string) => {
    await registrationService.toggleCheckIn(id);
    const updatedList = await registrationService.fetchRegistrationsFromDb();
    setRegistrations(updatedList);
    if (inspectCandidate && (inspectCandidate.id === id || inspectCandidate._id === id)) {
      const found = updatedList.find((r) => r.id === id || r._id === id || r.registrationId === id);
      if (found) setInspectCandidate(found);
    }
  };

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) return;
    const headers = [
      "Ticket ID",
      "Attendee Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Year",
      "Event Title",
      "Event Date",
      "Status",
      "Registered At",
    ];

    const rows = filteredCandidates.map((c) => [
      `"${c.registrationId || c.id}"`,
      `"${c.fullName || c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.college}"`,
      `"${c.department || ''}"`,
      `"${c.yearOfStudy || c.year || ''}"`,
      `"${c.eventTitle}"`,
      `"${c.eventDate}"`,
      `"${c.checkedIn ? 'Checked In' : 'Confirmed'}"`,
      `"${c.registeredAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GDG-FIEM-RSVP-Candidates-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter candidates
  const filteredCandidates = registrations.filter((reg) => {
    // Event filter
    const matchesEvent = selectedEventId === "all" || reg.eventId === selectedEventId;

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "checked_in" ? reg.checkedIn : !reg.checkedIn);

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (reg.name && reg.name.toLowerCase().includes(q)) ||
      (reg.fullName && reg.fullName.toLowerCase().includes(q)) ||
      (reg.email && reg.email.toLowerCase().includes(q)) ||
      (reg.id && reg.id.toLowerCase().includes(q)) ||
      (reg.registrationId && reg.registrationId.toLowerCase().includes(q)) ||
      (reg.college && reg.college.toLowerCase().includes(q)) ||
      (reg.eventTitle && reg.eventTitle.toLowerCase().includes(q));

    return matchesEvent && matchesStatus && matchesSearch;
  });

  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const confirmedCount = totalCount - checkedInCount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="rsvp-candidates-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-white border border-[#DADCE0] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#DADCE0] flex items-center justify-between gap-4 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1A73E8] border border-blue-200">
                <Users className="w-3 h-3 text-[#1A73E8]" />
                <span>RSVP Candidate Directory</span>
              </span>
              <span className="text-xs text-neutral-300 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-[#5F6368] hidden sm:inline">
                GDG on Campus FIEM Registrations
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#1A73E8]" />
              <span>Registered Attendees & Candidates</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredCandidates.length === 0}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#3C4043] hover:text-[#202124] bg-neutral-100 hover:bg-neutral-200 border border-[#DADCE0] transition-colors hidden sm:inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download filtered candidates as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              id="close-rsvp-candidates-btn"
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#5F6368] hover:text-[#202124] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Pill Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#DADCE0] bg-[#F8F9FA] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="text-[#5F6368]">
              Total Candidates: <strong className="text-[#202124] font-mono">{totalCount}</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[#137333] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
              Checked In: <strong className="font-mono">{checkedInCount}</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[#1A73E8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
              Pending Check-In: <strong className="font-mono">{confirmedCount}</strong>
            </span>
          </div>

          <div className="text-[11px] text-[#5F6368] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#FBBC04]" />
            <span>Persisted in MongoDB / Local Store</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:px-6 py-3.5 bg-white border-b border-[#DADCE0] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#80868B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate by name, email, ticket ID, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#DADCE0] rounded-xl text-xs text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8] transition-colors"
            />
          </div>

          {/* Event Filter Select */}
          <div className="flex items-center gap-2">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 bg-white border border-[#DADCE0] rounded-xl text-xs text-[#202124] focus:outline-none focus:border-[#1A73E8] max-w-[220px] truncate"
            >
              <option value="all">All Events ({totalCount})</option>
              {events.map((evt) => {
                const count = registrations.filter((r) => r.eventId === evt.id || r.eventId === evt.slug).length;
                return (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({count})
                  </option>
                );
              })}
            </select>

            {/* Status Segment */}
            <div className="flex items-center rounded-xl bg-neutral-100 border border-[#DADCE0] p-0.5">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white text-[#202124] font-semibold shadow-xs"
                    : "text-[#5F6368] hover:text-[#202124]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("checked_in")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === "checked_in"
                    ? "bg-emerald-100 text-[#137333] font-semibold shadow-xs"
                    : "text-[#5F6368] hover:text-[#202124]"
                }`}
              >
                Checked In
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("confirmed")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === "confirmed"
                    ? "bg-blue-100 text-[#1A73E8] font-semibold shadow-xs"
                    : "text-[#5F6368] hover:text-[#202124]"
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Candidate Table / Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3 bg-[#F8F9FA] rounded-2xl border border-[#DADCE0] max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-[#5F6368] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#202124]">No candidates found</h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                {searchQuery || selectedEventId !== "all" || statusFilter !== "all"
                  ? "No registered candidates match your selected filters. Try clearing search or switching event."
                  : "No students have RSVP'd yet. Once attendees submit their registration, they will appear here."}
              </p>
              {(searchQuery || selectedEventId !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedEventId("all");
                    setStatusFilter("all");
                  }}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#DADCE0] overflow-hidden shadow-xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#DADCE0] bg-[#F8F9FA] text-[#5F6368] font-mono uppercase tracking-wider text-[10px]">
                      <th className="p-3 pl-4">Ticket ID</th>
                      <th className="p-3">Candidate / Attendee</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Academic Institution</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DADCE0]">
                    {filteredCandidates.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-neutral-50 transition-colors group"
                      >
                        {/* Ticket ID */}
                        <td className="p-3 pl-4 font-mono">
                          <button
                            type="button"
                            onClick={() => setInspectCandidate(c)}
                            className="font-bold text-[#B06000] hover:text-[#E37400] hover:underline flex items-center gap-1 cursor-pointer"
                            title="Click to view digital QR pass"
                          >
                            <Ticket className="w-3 h-3 text-[#FBBC04]" />
                            <span>{c.registrationId || c.id}</span>
                          </button>
                          <div className="text-[10px] text-[#5F6368]">
                            {new Date(c.registeredAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>

                        {/* Candidate Name */}
                        <td className="p-3">
                          <div className="font-bold text-[#202124] text-xs">
                            {c.fullName || c.name}
                          </div>
                          <div className="text-[11px] text-[#5F6368] font-mono truncate max-w-[180px]">
                            {c.email}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="p-3 font-mono text-[#3C4043] whitespace-nowrap">
                          {c.phone || "—"}
                        </td>

                        {/* Target Event */}
                        <td className="p-3 max-w-[200px]">
                          <div className="font-medium text-[#202124] truncate" title={c.eventTitle}>
                            {c.eventTitle}
                          </div>
                          <div className="text-[10px] text-[#5F6368] font-mono">
                            {c.eventDate}
                          </div>
                        </td>

                        {/* Academic */}
                        <td className="p-3 max-w-[180px]">
                          <div className="text-[#3C4043] truncate" title={c.college}>
                            {c.college}
                          </div>
                          <div className="text-[10px] text-[#5F6368] font-mono">
                            {c.yearOfStudy || c.year || "Student"} • {c.department || "Tech"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3 whitespace-nowrap">
                          {c.checkedIn ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#137333] border border-emerald-200 text-[11px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-[#34A853]" />
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200 text-[11px] font-bold">
                              <Clock className="w-3 h-3 text-[#1A73E8]" />
                              Confirmed
                            </span>
                          )}
                        </td>

                        {/* Check-In / View Pass Action */}
                        <td className="p-3 pr-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleCheckIn(c.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                c.checkedIn
                                  ? "bg-neutral-100 text-[#3C4043] hover:bg-neutral-200"
                                  : "bg-[#1A73E8] hover:bg-blue-700 text-white shadow-xs"
                              }`}
                            >
                              {c.checkedIn ? "Undo" : "Check In"}
                            </button>

                            <button
                              type="button"
                              onClick={() => setInspectCandidate(c)}
                              className="p-1 rounded-lg text-[#5F6368] hover:text-[#202124] hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Inspect full QR ticket pass"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-3 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl text-xs text-[#5F6368] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>
              💡 <strong>Tip:</strong> Click any <strong>Ticket ID</strong> or the inspect icon to preview, print, or download that candidate's official digital QR entrance pass.
            </span>
            <span className="text-[11px] text-[#80868B]">
              Showing {filteredCandidates.length} of {totalCount} candidates
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#5F6368] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            <span>Live Local Sync Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#202124] bg-white hover:bg-neutral-100 border border-[#DADCE0] transition-colors cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Ticket Pass Overlay */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-[#DADCE0] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
              <span className="text-xs font-mono text-[#5F6368]">
                Official Digital QR Entry Pass
              </span>
              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#5F6368] hover:text-[#202124] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QRPass
              registration={inspectCandidate}
              onClose={() => setInspectCandidate(null)}
            />

            <div className="pt-2 flex items-center justify-between border-t border-[#DADCE0] text-xs">
              <button
                type="button"
                onClick={() => handleToggleCheckIn(inspectCandidate.id)}
                className={`py-2 px-4 rounded-xl font-semibold transition-colors cursor-pointer ${
                  inspectCandidate.checkedIn
                    ? "bg-neutral-100 text-[#3C4043] hover:bg-neutral-200"
                    : "bg-[#1A73E8] hover:bg-blue-700 text-white"
                }`}
              >
                {inspectCandidate.checkedIn ? "Undo Check-In" : "Check In Candidate"}
              </button>

              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="py-2 px-4 rounded-xl font-semibold text-[#5F6368] hover:text-[#202124] transition-colors cursor-pointer"
              >
                Back to Candidates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
