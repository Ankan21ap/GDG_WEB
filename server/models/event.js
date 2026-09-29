import mongoose from "mongoose";

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

// Virtual aliases to ensure compatibility with client UI
eventSchema.virtual("shortDescription").get(function () {
  return this.description;
});

eventSchema.virtual("fullDescription").get(function () {
  return this.description;
});

eventSchema.virtual("totalSeats").get(function () {
  return this.capacity;
});

eventSchema.virtual("seatsRemaining").get(function () {
  const cap = this.capacity || 100;
  const count = this.registrationCount || 0;
  return Math.max(0, cap - count);
});

eventSchema.virtual("category").get(function () {
  return ["AI", "Web", "Cloud", "Android", "Career", "Hackathon"].includes(this.type)
    ? this.type
    : "Workshop";
});

eventSchema.virtual("displayDate").get(function () {
  if (!this.date) return "";
  try {
    return new Date(this.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(this.date);
  }
});

// Virtual populate: retrieve all attendees belonging to this event
eventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "_id",
  foreignField: "eventId",
});

const Event = mongoose.models?.Event || mongoose.model("Event", eventSchema);

export { eventSchema };
export default Event;

