import QRCode from "qrcode";
import { Registration } from "../types";

const API_BASE = "http://localhost:4000/api";
const STORAGE_KEY = "gdg_fiem_registrations_v1";
const SIMULATE_SERVER_ERROR_KEY = "gdg_fiem_simulate_server_error";

export interface RegisterPayload {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department?: string;
  year?: string;
  experienceLevel?: string;
}

export interface RegisterResult {
  success: boolean;
  registration?: Registration;
  error?: string;
  isDuplicate?: boolean;
}

/** Convert a MongoDB Registration document to frontend Registration type */
function mongoToRegistration(doc: any, fallbackQr?: string): Registration {
  const eventInfo = doc.eventId && typeof doc.eventId === "object" ? doc.eventId : null;
  const ticketId = doc.registrationId || doc.id || doc._id;

  return {
    id: ticketId,
    _id: doc._id || ticketId,
    registrationId: ticketId,
    eventId: eventInfo ? (eventInfo._id || eventInfo.id || doc.eventId) : doc.eventId,
    eventTitle: eventInfo?.title || doc.eventTitle || "GDG Event",
    eventDate: eventInfo?.displayDate || doc.eventDate || "",
    eventTime: eventInfo?.startTime ? `${eventInfo.startTime} - ${eventInfo.endTime || ""}` : (doc.eventTime || ""),
    eventVenue: eventInfo?.venue || doc.eventVenue || "FIEM Campus",
    name: doc.fullName || doc.name || "",
    fullName: doc.fullName || doc.name || "",
    email: doc.email || "",
    phone: doc.phone || "",
    college: doc.college || "",
    department: doc.department || "Computer Science & Engineering",
    year: doc.yearOfStudy || doc.year || "3rd Year",
    yearOfStudy: doc.yearOfStudy || doc.year || "3rd Year",
    experienceLevel: doc.experienceLevel || "Intermediate",
    status: doc.status || "confirmed",
    checkedIn: !!doc.checkedIn,
    checkedInAt: doc.checkedInAt || null,
    registeredAt: doc.createdAt || new Date().toISOString(),
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
    qrDataUrl: doc.qrCodeDataUrl || fallbackQr || "",
    qrCodeDataUrl: doc.qrCodeDataUrl || fallbackQr || "",
  };
}

/**
 * Service layer connecting to Express/MongoDB REST backend
 * with client caching, duplicate handling, and QR generation.
 */
class RegistrationService {
  constructor() {
    this.fetchRegistrationsFromDb().catch(() => {});
  }

  private getStoredRegistrations(): Registration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveRegistrations(list: Registration[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to cache registrations in localStorage", e);
    }
  }

  private generateTicketId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `GDG-FIEM-${code}`;
  }

  public generateObjectId(): string {
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
    const machine = "4e3e49a1b6";
    const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    return `${timestamp}${machine}${counter}`.toLowerCase();
  }

  public isSimulateServerError(): boolean {
    return localStorage.getItem(SIMULATE_SERVER_ERROR_KEY) === "true";
  }

  public setSimulateServerError(value: boolean): void {
    localStorage.setItem(SIMULATE_SERVER_ERROR_KEY, value ? "true" : "false");
  }

  /**
   * Fetches all registrations from MongoDB backend and updates local cache
   */
  public async fetchRegistrationsFromDb(): Promise<Registration[]> {
    try {
      const res = await fetch(`${API_BASE}/rsvp`);
      if (!res.ok) {
        return this.getStoredRegistrations();
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        const mapped = data.registrations.map((doc: any) => mongoToRegistration(doc));
        this.saveRegistrations(mapped);
        return mapped;
      }
      return this.getStoredRegistrations();
    } catch {
      return this.getStoredRegistrations();
    }
  }

  /**
   * Submits an RSVP registration to MongoDB backend
   */
  public async register(payload: RegisterPayload): Promise<RegisterResult> {
    if (this.isSimulateServerError()) {
      return {
        success: false,
        error: "Internal Server Error (Simulated for Interview Demo). Please retry or toggle simulation off.",
      };
    }

    const ticketId = this.generateTicketId();
    const normalizedEmail = payload.email.trim().toLowerCase();

    // Generate QR code data URL
    const qrPayload = JSON.stringify({
      ticketId,
      eventId: payload.eventId,
      attendee: payload.name,
      email: normalizedEmail,
      eventTitle: payload.eventTitle,
      date: payload.eventDate,
      venue: payload.eventVenue,
      issuer: "GDG on Campus FIEM",
    });

    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 280,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });
    } catch (e) {
      console.error("QR Generation error", e);
    }

    // Call MongoDB backend POST /api/rsvp
    try {
      const response = await fetch(`${API_BASE}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: payload.eventId,
          fullName: payload.name.trim(),
          name: payload.name.trim(),
          email: normalizedEmail,
          phone: payload.phone.trim(),
          college: payload.college.trim(),
          department: payload.department?.trim() || "Computer Science & Engineering",
          yearOfStudy: payload.year || "3rd Year",
          year: payload.year || "3rd Year",
          experienceLevel: payload.experienceLevel || "Intermediate",
          qrCodeDataUrl: qrDataUrl,
        }),
      });

      const resData = await response.json();

      if (response.status === 409 || resData.isDuplicate) {
        const dupRecord = resData.registration ? mongoToRegistration(resData.registration, qrDataUrl) : undefined;
        return {
          success: false,
          isDuplicate: true,
          error: resData.error || "This email is already registered for this event.",
          registration: dupRecord,
        };
      }

      if (!response.ok || !resData.success) {
        return {
          success: false,
          error: resData.error || "Failed to register for event.",
        };
      }

      // Successful registration in MongoDB!
      const newRecord = mongoToRegistration(resData.registration, qrDataUrl);
      
      // Update local cache
      const currentList = this.getStoredRegistrations().filter(
        (r) => r.id !== newRecord.id && r._id !== newRecord._id
      );
      currentList.unshift(newRecord);
      this.saveRegistrations(currentList);

      // Notify application of updates
      window.dispatchEvent(new CustomEvent("gdg_registrations_updated"));
      window.dispatchEvent(new CustomEvent("gdg_events_updated"));
      window.dispatchEvent(new CustomEvent("gdg_rsvp_success", { detail: { registration: newRecord } }));

      return {
        success: true,
        registration: newRecord,
      };
    } catch (networkErr: any) {
      console.warn("Backend unavailable, falling back to local storage:", networkErr);
      
      // Fallback to local storage if server is down
      const all = this.getStoredRegistrations();
      const existing = all.find(
        (r) => r.eventId === payload.eventId && r.email.trim().toLowerCase() === normalizedEmail
      );

      if (existing) {
        return {
          success: false,
          error: "This email is already registered for this event.",
          isDuplicate: true,
          registration: existing,
        };
      }

      const nowIso = new Date().toISOString();
      const objectId = this.generateObjectId();

      const fallbackRecord: Registration = {
        id: ticketId,
        _id: objectId,
        registrationId: ticketId,
        eventId: payload.eventId,
        eventTitle: payload.eventTitle,
        eventDate: payload.eventDate,
        eventTime: payload.eventTime,
        eventVenue: payload.eventVenue,
        name: payload.name.trim(),
        fullName: payload.name.trim(),
        email: normalizedEmail,
        phone: payload.phone.trim(),
        college: payload.college.trim(),
        department: payload.department?.trim() || "Computer Science & Engineering",
        year: payload.year || "3rd Year",
        yearOfStudy: payload.year || "3rd Year",
        experienceLevel: payload.experienceLevel || "Intermediate",
        status: "confirmed",
        checkedIn: false,
        checkedInAt: null,
        registeredAt: nowIso,
        createdAt: nowIso,
        updatedAt: nowIso,
        qrDataUrl,
        qrCodeDataUrl: qrDataUrl,
      };

      all.unshift(fallbackRecord);
      this.saveRegistrations(all);

      window.dispatchEvent(new CustomEvent("gdg_registrations_updated"));

      return {
        success: true,
        registration: fallbackRecord,
      };
    }
  }

  /**
   * Toggles check-in state in MongoDB backend and updates cache
   */
  public async toggleCheckIn(registrationIdOrObjectId: string): Promise<Registration | undefined> {
    try {
      const res = await fetch(`${API_BASE}/rsvp/${registrationIdOrObjectId}/checkin`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.registration) {
          const updated = mongoToRegistration(data.registration);
          const all = this.getStoredRegistrations().map((r) =>
            r.id === updated.id || r._id === updated._id ? updated : r
          );
          this.saveRegistrations(all);
          window.dispatchEvent(new CustomEvent("gdg_registrations_updated"));
          return updated;
        }
      }
    } catch (e) {
      console.error("Check-in error:", e);
    }

    // Local fallback
    const all = this.getStoredRegistrations();
    const target = all.find(
      (r) =>
        r.id === registrationIdOrObjectId ||
        r._id === registrationIdOrObjectId ||
        r.registrationId === registrationIdOrObjectId
    );
    if (!target) return undefined;

    const newStatus = !target.checkedIn;
    target.checkedIn = newStatus;
    target.checkedInAt = newStatus ? new Date().toISOString() : null;
    target.status = newStatus ? "checked_in" : "confirmed";
    target.updatedAt = new Date().toISOString();

    this.saveRegistrations(all);
    window.dispatchEvent(new CustomEvent("gdg_registrations_updated"));
    return target;
  }

  public getRegistrationsByEvent(eventId: string): Registration[] {
    return this.getStoredRegistrations().filter(
      (r) => r.eventId === eventId || (r as any).eventId?._id === eventId
    );
  }

  public getRegistrations(): Registration[] {
    return this.getStoredRegistrations();
  }

  public getRegistrationById(id: string): Registration | undefined {
    return this.getStoredRegistrations().find(
      (r) => r.id === id || r._id === id || r.registrationId === id
    );
  }

  public clearAllRegistrations(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  public getGoogleCalendarUrl(
    eventTitle: string,
    details: string,
    location: string,
    dateStr: string
  ): string {
    try {
      const startDate = new Date(dateStr);
      const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);

      const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: `${eventTitle} - GDG on Campus FIEM`,
        dates: dates,
        details: `${details}\n\nOrganized by GDG on Campus FIEM.`,
        location: location,
      });

      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    } catch {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventTitle
      )}`;
    }
  }
}

export const registrationService = new RegistrationService();
