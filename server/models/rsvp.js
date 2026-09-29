import mongoose from "mongoose";

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
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number starting with 6-9"],
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

// Pre-save hook for sanitization
registrationSchema.pre("save", async function () {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.fullName) {
    this.fullName = this.fullName.trim();
  }
});

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

export { registrationSchema };
export default Registration;
