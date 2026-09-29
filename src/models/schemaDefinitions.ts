/**
 * Schema definitions, metadata, and validation helpers for GDG on Campus FIEM
 * Connects Mongoose models (rsvp.js / Registration and event.js / Event) to the frontend.
 */

export interface SchemaFieldMeta {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  indexed?: boolean;
  validation?: string;
  default?: string;
  ref?: string;
  enumValues?: string[];
  description: string;
}

export interface ModelMetadata {
  name: string;
  collection: string;
  filename: string;
  routeFilename: string;
  endpoint: string;
  description: string;
  primaryKey: string;
  relationships: string[];
  fields: SchemaFieldMeta[];
}

export const REGISTRATION_MODEL_META: ModelMetadata = {
  name: "Registration",
  collection: "registrations",
  filename: "rsvp.js",
  routeFilename: "routes/rsvp.js",
  endpoint: "/api/rsvp",
  description:
    "Manages individual attendee registrations, verified ticket codes, contact credentials, and attendance check-in status, linked to parent Event.",
  primaryKey: "_id (ObjectId)",
  relationships: ["BelongsTo Event via eventId (ref: 'Event')"],
  fields: [
    {
      name: "_id",
      type: "ObjectId",
      required: true,
      unique: true,
      indexed: true,
      description: "Auto-generated 24-character hexadecimal MongoDB Object identifier.",
    },
    {
      name: "eventId",
      type: "ObjectId",
      required: true,
      indexed: true,
      ref: "Event",
      description: "Foreign key reference to parent Event document. Used with .populate('eventId').",
    },
    {
      name: "registrationId",
      type: "String",
      required: true,
      unique: true,
      indexed: true,
      validation: "Unique ticket string (e.g. GDG-FIEM-XXXXX)",
      description: "Human-scannable ticket ID embedded into the attendee's QR pass.",
    },
    {
      name: "fullName",
      type: "String",
      required: true,
      validation: "minlength: 2, maxlength: 100, trim: true",
      description: "Full legal or preferred name of the student attendee.",
    },
    {
      name: "email",
      type: "String",
      required: true,
      indexed: true,
      validation: "/^[^\s@]+@[^\s@]+\.[^\s@]+$/, lowercase: true, trim: true",
      description: "Primary contact email address. Compounded with eventId for uniqueness.",
    },
    {
      name: "phone",
      type: "String",
      required: true,
      validation: "/^[6-9]\d{9}$/ (10-digit Indian mobile starting with 6-9)",
      description: "WhatsApp/SMS reachable mobile number for event announcements.",
    },
    {
      name: "college",
      type: "String",
      required: true,
      validation: "maxlength: 150, trim: true",
      description: "College or university name (e.g., Future Institute of Engineering and Management).",
    },
    {
      name: "department",
      type: "String",
      required: false,
      default: "'Computer Science & Engineering'",
      validation: "maxlength: 100, trim: true",
      description: "Academic department or technical specialization.",
    },
    {
      name: "yearOfStudy",
      type: "String",
      required: true,
      enumValues: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Postgraduate",
        "Alumni / Professional",
      ],
      description: "Current academic year of study.",
    },
    {
      name: "experienceLevel",
      type: "String",
      required: false,
      default: "'Intermediate'",
      enumValues: ["Beginner", "Intermediate", "Advanced"],
      description: "Self-assessed programming and technology comfort level.",
    },
    {
      name: "qrCodeDataUrl",
      type: "String",
      required: false,
      description: "Base64 encoded data URI string for the verifiable ticket QR badge.",
    },
    {
      name: "status",
      type: "String",
      required: false,
      default: "'confirmed'",
      enumValues: ["confirmed", "waitlisted", "cancelled", "checked_in"],
      indexed: true,
      description: "Ticket lifecycle status.",
    },
    {
      name: "checkedIn",
      type: "Boolean",
      required: false,
      default: "false",
      description: "Boolean flag toggled when attendee is verified at venue reception.",
    },
    {
      name: "checkedInAt",
      type: "Date",
      required: false,
      default: "null",
      description: "Timestamp when check-in badge was scanned at FIEM auditorium.",
    },
    {
      name: "createdAt / updatedAt",
      type: "Date",
      required: false,
      description: "Mongoose timestamps automatically maintained.",
    },
  ],
};

export const EVENT_MODEL_META: ModelMetadata = {
  name: "Event",
  collection: "events",
  filename: "event.js",
  routeFilename: "routes/event.js",
  endpoint: "/api/events",
  description:
    "Defines community events, workshops, hackathons, agendas, guest speaker rosters, seat inventory, and geographical coordinates.",
  primaryKey: "_id (ObjectId)",
  relationships: ["HasMany Registrations via virtual populate ('registrations')"],
  fields: [
    {
      name: "_id",
      type: "ObjectId",
      required: true,
      unique: true,
      indexed: true,
      description: "Auto-generated 24-character hexadecimal MongoDB Object identifier.",
    },
    {
      name: "title",
      type: "String",
      required: true,
      indexed: true,
      validation: "maxlength: 200, trim: true",
      description: "Official public headline of the event.",
    },
    {
      name: "slug",
      type: "String",
      required: true,
      unique: true,
      indexed: true,
      validation: "lowercase: true, trim: true",
      description: "URL slug used for clean dynamic routing (e.g. /events/cloud-devfest-2025).",
    },
    {
      name: "shortDescription",
      type: "String",
      required: true,
      validation: "maxlength: 300, trim: true",
      description: "Snappy overview teaser used on event listing cards and social preview tags.",
    },
    {
      name: "fullDescription",
      type: "String",
      required: true,
      description: "Comprehensive Markdown or rich description detailing objectives and format.",
    },
    {
      name: "type",
      type: "String",
      required: true,
      enumValues: ["Workshop", "Hackathon", "Speaker Session", "Study Jam", "Conference"],
      description: "Format category for the event.",
    },
    {
      name: "category",
      type: "String",
      required: true,
      indexed: true,
      enumValues: ["AI", "Web", "Cloud", "Android", "Career", "Hackathon"],
      description: "Primary Google technology track or community pillar.",
    },
    {
      name: "date",
      type: "Date",
      required: true,
      indexed: true,
      description: "Target calendar date used for ascending/descending chronological ordering.",
    },
    {
      name: "displayDate",
      type: "String",
      required: true,
      description: "Formatted human-friendly date string (e.g., October 18, 2025).",
    },
    {
      name: "startTime / endTime",
      type: "String",
      required: true,
      description: "Clock window for the event (e.g., '10:30 AM' - '04:30 PM').",
    },
    {
      name: "venue",
      type: "String",
      required: true,
      description: "Physical room/hall (e.g., 'Auditorium 1, FIEM Campus').",
    },
    {
      name: "address",
      type: "String",
      required: true,
      description: "Physical postal address with landmark.",
    },
    {
      name: "mapCoordinates",
      type: "Object { lat, lng }",
      required: false,
      description: "Geocoded coordinates for Google Maps integration.",
    },
    {
      name: "image",
      type: "String",
      required: true,
      description: "High-resolution banner cover photograph URL.",
    },
    {
      name: "speakers",
      type: "Array of SpeakerSubSchema",
      required: false,
      description: "Embedded subdocuments containing speaker name, role, organization, avatar, bio, and social links.",
    },
    {
      name: "agenda",
      type: "Array of AgendaSubSchema",
      required: false,
      description: "Embedded chronological schedule items with session times, topics, and speakers.",
    },
    {
      name: "status",
      type: "String",
      required: false,
      default: "'upcoming'",
      enumValues: ["upcoming", "past"],
      indexed: true,
      description: "Event lifecycle state.",
    },
    {
      name: "registrationOpen",
      type: "Boolean",
      required: false,
      default: "true",
      description: "Controls whether the RSVP form accepts incoming registrations.",
    },
    {
      name: "totalSeats / seatsRemaining",
      type: "Number",
      required: false,
      default: "120",
      validation: "min: 0",
      description: "Auditorium capacity tracking. Decremented atomically upon each confirmed RSVP.",
    },
    {
      name: "attendeesCount",
      type: "Number",
      required: false,
      default: "0",
      description: "Counter for confirmed registrations and historical attendees.",
    },
  ],
};

export const MONGOOSE_RSVP_CODE = `import mongoose from "mongoose";

/**
 * Registration / RSVP Model Schema for GDG on Campus FIEM
 * Defines attendee bookings, unique ticket codes, and relational link to Event.
 */
const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required to register for an event"],
      index: true,
    },

    registrationId: {
      type: String,
      required: [true, "Unique ticket/registration ID is required"],
      unique: true,
      index: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
      index: true,
    },

    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
      match: [/^[6-9]\\d{9}$/, "Please enter a valid 10-digit mobile number starting with 6-9"],
    },

    college: {
      type: String,
      required: [true, "College or institution name is required"],
      trim: true,
      maxlength: [150, "College name cannot exceed 150 characters"],
    },

    department: {
      type: String,
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
      default: "Computer Science & Engineering",
    },

    yearOfStudy: {
      type: String,
      enum: {
        values: [
          "1st Year",
          "2nd Year",
          "3rd Year",
          "4th Year",
          "Postgraduate",
          "Alumni / Professional",
        ],
        message: "{VALUE} is not a valid year of study",
      },
      required: [true, "Year of study is required"],
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    qrCodeDataUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled", "checked_in"],
      default: "confirmed",
      index: true,
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations for the same event and email
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

export { registrationSchema };
export default Registration;`;

export const MONGOOSE_EVENT_CODE = `import mongoose from "mongoose";

/**
 * Event Model Schema for GDG on Campus FIEM
 * Defines scheduled events, tracks, capacity, and registration counts.
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "AI",
        "Web",
        "Cloud",
        "Android",
        "Career",
        "Hackathon",
        "Workshop",
        "Meetup",
      ],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: String,
    endTime: String,

    venue: {
      type: String,
      required: true,
    },

    address: String,

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registrationCount: {
      type: Number,
      default: 0,
    },

    image: String,

    status: {
      type: String,
      enum: ["upcoming", "live", "past"],
      default: "upcoming",
    },

    registrationOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getters for frontend compatibility
eventSchema.virtual("shortDescription").get(function () {
  return this.description && this.description.length > 180
    ? this.description.slice(0, 180) + "..."
    : this.description || "";
});

eventSchema.virtual("fullDescription").get(function () {
  return this.description || "";
});

eventSchema.virtual("totalSeats").get(function () {
  return this.capacity;
});

eventSchema.virtual("seatsRemaining").get(function () {
  return Math.max(0, (this.capacity || 0) - (this.registrationCount || 0));
});

eventSchema.virtual("category").get(function () {
  return ["AI", "Web", "Cloud", "Android", "Career", "Hackathon"].includes(this.type)
    ? this.type
    : "AI";
});

// Virtual populate: retrieve all registrations belonging to this event
eventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "_id",
  foreignField: "eventId",
});

const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

export { eventSchema };
export default Event;`;

export const EXPRESS_RSVP_ROUTE_CODE = `import express from "express";
import Registration from "../models/rsvp.js";
import Event from "../models/event.js";

const router = express.Router();

/**
 * POST /api/rsvp - Register for an event & decrement available seats
 */
router.post("/", async (req, res) => {
  try {
    const { eventId, fullName, email, phone, college, department, yearOfStudy } = req.body;

    // Validate phone pattern (/^[6-9]\\d{9}$/)
    if (!/^[6-9]\\d{9}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid 10-digit mobile number starting with 6-9" });
    }

    // Verify event exists & has seats
    const event = await Event.findById(eventId);
    if (!event || !event.registrationOpen || event.seatsRemaining <= 0) {
      return res.status(400).json({ error: "Event registration is closed or at capacity" });
    }

    // Duplicate check
    const existing = await Registration.findOne({ eventId: event._id, email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ isDuplicate: true, registration: existing });
    }

    // Create & save Registration document
    const registrationId = \`GDG-FIEM-\${Math.random().toString(36).substring(2, 7).toUpperCase()}\`;
    const registration = new Registration({
      ...req.body,
      registrationId,
      eventId: event._id,
      email: email.toLowerCase().trim(),
    });
    await registration.save();

    // Decrement seat count atomically
    await Event.findByIdAndUpdate(event._id, { $inc: { seatsRemaining: -1, attendeesCount: 1 } });

    // Populate relational event metadata
    const populated = await Registration.findById(registration._id).populate("eventId");
    return res.status(201).json({ success: true, registration: populated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/rsvp/:registrationId - Query pass with populated event
 */
router.get("/:registrationId", async (req, res) => {
  const reg = await Registration.findOne({ registrationId: req.params.registrationId }).populate("eventId");
  if (!reg) return res.status(404).json({ error: "Pass not found" });
  res.json({ success: true, registration: reg });
});

export default router;`;

export const EXPRESS_EVENT_ROUTE_CODE = `import express from "express";
import Event from "../models/event.js";

const router = express.Router();

/**
 * GET /api/events - Query events with optional status and category filters
 */
router.get("/", async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const events = await Event.find(filter).sort({ date: status === "past" ? -1 : 1 });
  res.json({ success: true, count: events.length, events });
});

/**
 * GET /api/events/:slug - Retrieve event details by slug
 */
router.get("/:slug", async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json({ success: true, event });
});

export default router;`;

/**
 * Client-Side Mongoose Schema Validator
 * Executes the exact validation rules declared in the Mongoose schema
 */
export interface ValidationErrorResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateRegistrationAgainstSchema(data: {
  eventId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  yearOfStudy?: string;
}): ValidationErrorResult {
  const errors: Record<string, string> = {};

  // eventId (ObjectId / reference check)
  if (!data.eventId || data.eventId.trim() === "") {
    errors.eventId = "Path `eventId` is required (ref: 'Event').";
  }

  // fullName (minlength: 2, maxlength: 100)
  if (!data.fullName || data.fullName.trim() === "") {
    errors.fullName = "Path `fullName` is required.";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = `Path \`fullName\` (\`${data.fullName}\`) is shorter than the minimum allowed length (2).`;
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = `Path \`fullName\` is longer than the maximum allowed length (100).`;
  }

  // email (regex match)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim() === "") {
    errors.email = "Path `email` is required.";
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = `\`${data.email}\` is not a valid email address. Failed match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/`;
  }

  // phone (regex match: /^[6-9]\d{9}$/)
  const phoneClean = (data.phone || "").replace(/[\s-]/g, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneClean) {
    errors.phone = "Path `phone` is required.";
  } else if (!phoneRegex.test(phoneClean)) {
    errors.phone = `\`${data.phone}\` is not a valid Indian mobile number. Validator failed: /^[6-9]\\d{9}$/ (Must be 10 digits starting with 6, 7, 8, or 9).`;
  }

  // college (maxlength: 150)
  if (!data.college || data.college.trim() === "") {
    errors.college = "Path `college` is required.";
  } else if (data.college.trim().length > 150) {
    errors.college = "Path `college` exceeds maximum length of 150 characters.";
  }

  // yearOfStudy (enum check)
  const allowedYears = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Postgraduate",
    "Alumni / Professional",
  ];
  if (!data.yearOfStudy) {
    errors.yearOfStudy = "Path `yearOfStudy` is required.";
  } else if (!allowedYears.includes(data.yearOfStudy)) {
    errors.yearOfStudy = `\`${data.yearOfStudy}\` is not a valid enum value for path \`yearOfStudy\`. Allowed: ${allowedYears.join(", ")}`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
