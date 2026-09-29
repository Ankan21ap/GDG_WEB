export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  speakerId?: string;
  speakerName?: string;
  description: string;
  tag?: string;
  duration?: string;
}

export interface EventOutcome {
  metric: string;
  label: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string; // Mongoose schema field
  shortDescription: string;
  fullDescription: string;
  type: "AI" | "Web" | "Cloud" | "Android" | "Career" | "Hackathon" | "Workshop" | "Meetup" | "Speaker Session" | "Study Jam" | "Conference";
  category?: "AI" | "Web" | "Cloud" | "Android" | "Career" | "Hackathon" | string;
  date: string; // ISO or readable
  displayDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  capacity?: number; // Mongoose schema field
  registrationCount?: number; // Mongoose schema field
  mapCoordinates?: { lat: number; lng: number };
  image: string;
  galleryImages?: string[];
  speakers?: Speaker[];
  agenda?: AgendaItem[];
  status: "upcoming" | "live" | "past";
  registrationOpen: boolean;
  totalSeats?: number;
  seatsRemaining?: number;
  prerequisites?: string[];
  whatToBring?: string[];
  whatYouWillLearn?: string[];
  faqs?: { question: string; answer: string }[];
  outcomes?: EventOutcome[];
  highlights?: string[];
  attendeesCount?: number;
}

export interface Registration {
  id: string; // Ticket ID e.g. GDG-FIEM-8X29K
  _id?: string; // MongoDB ObjectId
  registrationId?: string; // Mongoose schema alias for id
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  name: string;
  fullName?: string; // Mongoose schema alias
  email: string;
  phone: string;
  college: string;
  department?: string;
  year?: string;
  yearOfStudy?: string; // Mongoose schema alias
  experienceLevel?: string;
  registeredAt: string;
  qrDataUrl?: string;
  qrCodeDataUrl?: string; // Mongoose schema alias
  status?: "confirmed" | "waitlisted" | "cancelled" | "checked_in";
  checkedIn?: boolean;
  checkedInAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  eventTitle: string;
  date: string;
  category: "Workshops" | "Hackathons" | "Meetups" | "Community" | string;
  imageUrl: string;
  dimensions?: { width: number; height: number };
  eventStatus?: "upcoming" | "past";
}

export interface FAQItem {
  id: string;
  category: "Events" | "Registration" | "Participation" | "Certificates" | "Community" | "Technical";
  question: string;
  answer: string;
}
