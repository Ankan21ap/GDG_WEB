import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  Ticket, 
  Printer, 
  MessageSquare,
  Copy,
  Check,
  Smartphone
} from "lucide-react";
import QRCode from "qrcode";
import { Registration } from "../types";
import { GoogleColorsBar, GoogleDots } from "./GoogleColorsBar";
import { GDGLogo } from "./GDGLogo";
import { registrationService } from "../services/registrationService";

interface QRPassProps {
  registration: Registration;
  onClose?: () => void;
}

export function QRPass({ registration, onClose }: QRPassProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(
    registration.qrDataUrl || registration.qrCodeDataUrl || ""
  );

  const ticketId = registration.registrationId || registration.id;
  const attendeeName = registration.name || registration.fullName || "Attendee";

  // Generate QR code if not already available
  useEffect(() => {
    const existing = registration.qrDataUrl || registration.qrCodeDataUrl;
    if (existing) {
      setQrCodeUrl(existing);
      return;
    }

    const qrPayload = JSON.stringify({
      ticketId,
      eventId: registration.eventId,
      attendee: attendeeName,
      email: registration.email,
      eventTitle: registration.eventTitle,
      date: registration.eventDate,
      venue: registration.eventVenue,
      issuer: "GDG on Campus FIEM",
    });

    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: "#202124",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR generation error:", err));
  }, [registration, ticketId, attendeeName]);

  const googleCalUrl = registrationService.getGoogleCalendarUrl(
    registration.eventTitle,
    `Your confirmed seat for ${registration.eventTitle} with Ticket ID: ${ticketId}`,
    registration.eventVenue,
    registration.eventDate
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const src = qrCodeUrl || registration.qrDataUrl || registration.qrCodeDataUrl;
    if (!src) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = `GDG-Pass-${ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const smsConfirmationText = `🎉 [GDG on Campus FIEM - RSVP Confirmed]\nHi ${attendeeName}! Your RSVP for ${registration.eventTitle} is confirmed.\n🎟️ Ticket ID: ${ticketId}\n📅 Date: ${registration.eventDate || "Campus Schedule"}\n📍 Venue: ${registration.eventVenue || "FIEM Auditorium"}\nPlease show your QR pass at the entrance check-in desk. See you there!`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsConfirmationText);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2200);
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full animate-in fade-in duration-300 text-[#202124]">
      {/* 1. Success Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-3 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>RSVP Complete • Seat Confirmed</span>
          </span>

          {registration.phone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 text-[#1A73E8] border border-blue-200">
              <Smartphone className="w-3 h-3 text-[#1A73E8]" />
              <span>SMS Alert: +91 {registration.phone}</span>
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
          🎉 RSVP Completed Successfully!
        </h3>
        <p className="text-sm text-[#5F6368] mt-1 max-w-md mx-auto leading-relaxed">
          Welcome, <span className="text-[#202124] font-bold">{attendeeName}</span>! Your registration is officially confirmed in the database with Ticket ID <span className="font-mono text-[#1A73E8] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{ticketId}</span>.
        </p>
      </div>

      {/* 2. The Printable Digital Pass Card */}
      <div
        ref={cardRef}
        id={`pass-card-${ticketId}`}
        className="w-full bg-white border border-[#DADCE0] rounded-3xl overflow-hidden shadow-lg relative text-left"
      >
        {/* Top Google Colors Strip */}
        <GoogleColorsBar className="h-2" />

        {/* Pass Header */}
        <div className="p-6 sm:p-7 border-b border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GDGLogo className="w-6 h-6" />
              <span className="text-xs font-bold tracking-wider text-[#202124] uppercase">
                GDG on Campus FIEM
              </span>
              <GoogleDots />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#202124] leading-snug">
              {registration.eventTitle}
            </h4>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#5F6368] uppercase tracking-widest block font-mono">
              Ticket Pass
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#1A73E8] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mt-1">
              {ticketId}
            </span>
          </div>
        </div>

        {/* Middle Notch Dividers */}
        <div className="relative flex items-center justify-between px-2 bg-white">
          <div className="w-5 h-6 bg-[#F8F9FA] rounded-r-full border-r border-t border-b border-[#DADCE0] -ml-3" />
          <div className="flex-1 border-b border-dashed border-neutral-300 mx-2" />
          <div className="w-5 h-6 bg-[#F8F9FA] rounded-l-full border-l border-t border-b border-[#DADCE0] -mr-3" />
        </div>

        {/* Body Details */}
        <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Attendee & Event Metadata */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] text-[#5F6368] uppercase tracking-wider block font-semibold font-mono">
                Attendee Name
              </span>
              <p className="text-base font-bold text-[#202124] flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span className="truncate">{attendeeName}</span>
              </p>
              <p className="text-xs text-[#5F6368] mt-0.5 truncate">{registration.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
              <div>
                <span className="text-[10px] text-[#70757A] uppercase tracking-wider block font-mono">
                  College / Org
                </span>
                <p className="text-xs font-semibold text-[#3C4043] truncate mt-0.5">
                  {registration.college}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-[#70757A] uppercase tracking-wider block font-mono">
                  Dept &amp; Year
                </span>
                <p className="text-xs font-semibold text-[#3C4043] truncate mt-0.5">
                  {registration.department || "CSE"} • {registration.year || registration.yearOfStudy || "3rd Year"}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-[#3C4043]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                <span className="font-semibold text-[#202124]">{registration.eventDate || "Upcoming Date"}</span>
              </div>
              {registration.eventTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{registration.eventTime}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{registration.eventVenue || "FIEM Campus Auditorium"}</span>
              </div>
            </div>
          </div>

          {/* QR Code Container with ID and Name */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center shadow-xs">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt={`QR verification pass for ${ticketId}`}
                className="w-40 h-40 object-contain rounded-xl bg-white p-2 shadow-xs border border-neutral-200"
              />
            ) : (
              <div className="w-40 h-40 bg-neutral-100 flex flex-col items-center justify-center text-xs text-[#5F6368] rounded-xl animate-pulse">
                <div className="w-6 h-6 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin mb-2" />
                <span>Generating QR...</span>
              </div>
            )}

            {/* Clearly shown ID and Name with QR Code */}
            <div className="w-full mt-2.5 pt-2.5 border-t border-neutral-200 space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate">
                ID: {ticketId}
              </div>
              <div className="text-xs font-bold text-[#202124] truncate max-w-[170px] mx-auto">
                {attendeeName}
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center justify-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Verified Entry QR</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pass Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 text-[11px] text-[#70757A] flex items-center justify-between font-mono">
          <span>Official GDG FIEM Pass</span>
          <span>Non-Transferable • Present at Gate</span>
        </div>
      </div>

      {/* 3. Real SMS Confirmation Notification Card on Page */}
      <div className="w-full mt-6 p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                SMS Confirmation Ready
              </h5>
              <p className="text-[11px] text-[#5F6368]">
                Notification sent to {registration.phone ? `+91 ${registration.phone}` : "your registered number"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySMS}
            className="text-xs font-semibold py-1.5 px-3 rounded-lg bg-white hover:bg-neutral-50 text-[#1A73E8] border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedSMS ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSMS ? "Copied!" : "Copy SMS"}</span>
          </button>
        </div>

        {/* SMS Message Body Preview */}
        <div className="mt-3 p-3 rounded-xl bg-white border border-blue-100 text-xs font-mono text-[#3C4043] leading-relaxed whitespace-pre-line select-all">
          {smsConfirmationText}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={handleDownloadQR}
          className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download QR Pass (PNG)</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Printer className="w-4 h-4 text-[#5F6368]" />
          <span>Print Pass</span>
        </button>

        {googleCalUrl && (
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#3C4043] bg-white hover:bg-neutral-50 hover:text-[#202124] border border-[#DADCE0] transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-[#1A73E8]" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#5F6368]" />
          </a>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-xs text-[#5F6368] hover:text-[#202124] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Events</span>
        </button>
      )}
    </div>
  );
}
