import { Event } from "../types";

const API_BASE = "http://localhost:4000/api";

export type MongooseEventType =
  | "AI"
  | "Web"
  | "Cloud"
  | "Android"
  | "Career"
  | "Hackathon"
  | "Workshop"
  | "Meetup";

export type MongooseEventStatus = "upcoming" | "live" | "past";

export interface MongooseEventPayload {
  title: string;
  slug: string;
  description: string;
  type: MongooseEventType;
  date: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  address?: string;
  capacity: number;
  registrationCount?: number;
  image?: string;
  status?: MongooseEventStatus;
  registrationOpen?: boolean;
}

export interface RegisterEventResult {
  success: boolean;
  event?: Event;
  error?: string;
  validationErrors?: Record<string, string>;
}

export const DEFAULT_EVENT_IMAGES: Record<MongooseEventType, string> = {
  AI: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=1200&q=80",
  Web: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  Cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  Android: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=1200&q=80",
  Career: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
  Hackathon: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  Workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  Meetup: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
};

/** Convert a raw MongoDB event document to the frontend Event type */
function mongoToEvent(doc: any): Event {
  const type: MongooseEventType = doc.type || "Workshop";
  const image = doc.image || DEFAULT_EVENT_IMAGES[type] || DEFAULT_EVENT_IMAGES.Workshop;
  const capacity = doc.capacity || 100;
  const registrationCount = doc.registrationCount || 0;

  return {
    id: doc._id || doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    shortDescription: doc.shortDescription || doc.description,
    fullDescription: doc.fullDescription || doc.description,
    type,
    category: doc.category || type,
    date: doc.date,
    displayDate: doc.displayDate || new Date(doc.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    startTime: doc.startTime || "10:00 AM",
    endTime: doc.endTime || "05:00 PM",
    venue: doc.venue,
    address: doc.address || "",
    capacity,
    registrationCount,
    totalSeats: doc.totalSeats || capacity,
    seatsRemaining: doc.seatsRemaining ?? Math.max(0, capacity - registrationCount),
    image,
    status: doc.status || "upcoming",
    registrationOpen: doc.registrationOpen ?? true,
    speakers: doc.speakers || [],
    agenda: doc.agenda || [],
    highlights: doc.highlights || [],
    whatYouWillLearn: doc.whatYouWillLearn || [],
    whatToBring: doc.whatToBring || [],
  };
}

class EventService {
  public generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** Fetch ALL events from the backend DB */
  public async getAllEvents(): Promise<Event[]> {
    try {
      const res = await fetch(`${API_BASE}/events`);
      const json = await res.json();
      if (json.success && Array.isArray(json.events)) {
        return json.events.map(mongoToEvent);
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch events from backend:", err);
      return [];
    }
  }

  /** Fetch only upcoming/live events */
  public async getUpcomingEvents(): Promise<Event[]> {
    try {
      const res = await fetch(`${API_BASE}/events?status=upcoming`);
      const json = await res.json();
      if (json.success && Array.isArray(json.events)) {
        return json.events.map(mongoToEvent);
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch upcoming events:", err);
      return [];
    }
  }

  /** Fetch only past events */
  public async getPastEvents(): Promise<Event[]> {
    try {
      const res = await fetch(`${API_BASE}/events?status=past`);
      const json = await res.json();
      if (json.success && Array.isArray(json.events)) {
        return json.events.map(mongoToEvent);
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch past events:", err);
      return [];
    }
  }

  /** Fetch single event by slug */
  public async getEventBySlug(slug: string): Promise<Event | undefined> {
    try {
      const res = await fetch(`${API_BASE}/events/${slug}`);
      const json = await res.json();
      if (json.success && json.event) {
        return mongoToEvent(json.event);
      }
      return undefined;
    } catch (err) {
      console.error("Failed to fetch event by slug:", err);
      return undefined;
    }
  }

  /** Create a new event — saves to DB and returns it */
  public async registerNewEvent(payload: MongooseEventPayload): Promise<RegisterEventResult> {
    const errors: Record<string, string> = {};

    const title = payload.title?.trim() || "";
    if (!title) errors.title = "Event title is required";

    const slug = (payload.slug?.trim() || this.generateSlug(title)).toLowerCase();
    if (!slug) errors.slug = "Event slug is required";

    const description = payload.description?.trim() || "";
    if (!description) errors.description = "Event description is required";

    const allowedTypes: MongooseEventType[] = ["AI", "Web", "Cloud", "Android", "Career", "Hackathon", "Workshop", "Meetup"];
    if (!payload.type || !allowedTypes.includes(payload.type)) {
      errors.type = "Valid event type is required";
    }

    if (!payload.date) {
      errors.date = "Event date is required";
    } else if (isNaN(new Date(payload.date).getTime())) {
      errors.date = "Invalid date format";
    }

    const venue = payload.venue?.trim() || "";
    if (!venue) errors.venue = "Venue is required";

    const capacity = Number(payload.capacity);
    if (!capacity || capacity < 1) errors.capacity = "Capacity must be at least 1";

    if (Object.keys(errors).length > 0) {
      return { success: false, error: "Please correct the highlighted fields.", validationErrors: errors };
    }

    const image = payload.image?.trim() || DEFAULT_EVENT_IMAGES[payload.type] || DEFAULT_EVENT_IMAGES.Workshop;

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          type: payload.type,
          date: new Date(payload.date).toISOString(),
          startTime: payload.startTime?.trim() || "10:00 AM",
          endTime: payload.endTime?.trim() || "05:00 PM",
          venue,
          address: payload.address?.trim() || "",
          capacity,
          image,
          status: payload.status || "upcoming",
          registrationOpen: payload.registrationOpen !== false,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to create event" };
      }

      // Notify other components
      window.dispatchEvent(new CustomEvent("gdg_events_updated"));

      return { success: true, event: mongoToEvent(json.event) };
    } catch (err: any) {
      return { success: false, error: "Could not connect to server. Make sure the backend is running on port 4000." };
    }
  }
}

export const eventService = new EventService();
