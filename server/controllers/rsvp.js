import Registration from "../models/rsvp.js";
import Event from "../models/event.js";
import QRCode from "qrcode";

/**
 * Generates a unique ticket ID in the format: GDG-FIEM-XXXXX
 */
function generateTicketId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GDG-FIEM-${code}`;
}

/**
 * POST /api/rsvp
 * Register an attendee for an event
 * Required body: eventId, fullName, email, phone, college, yearOfStudy
 */
export async function createRSVP(req, res) {
  try {
    const { eventId, fullName, name, email, phone, college, department, yearOfStudy, year, experienceLevel, qrCodeDataUrl } =
      req.body;

    const applicantName = (fullName || name || "").trim();
    const applicantYear = yearOfStudy || year || "";

    // 1. Required field check
    if (!eventId || !applicantName || !email || !phone || !college || !applicantYear) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: eventId, fullName (or name), email, phone, college, yearOfStudy (or year)",
      });
    }

    // 2. Validate Indian phone number
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: "Phone must be a valid 10-digit Indian number starting with 6–9",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find the event by _id or slug
    let event = null;
    try {
      event = await Event.findById(eventId);
    } catch {
      event = await Event.findOne({ slug: eventId });
    }
    if (!event) {
      event = await Event.findOne({ slug: eventId });
    }

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    // 4. Check registration is open and seats available
    if (!event.registrationOpen || event.seatsRemaining <= 0) {
      return res.status(400).json({
        success: false,
        error: "Registration is closed or the event is at full capacity",
      });
    }

    // 5. Check for duplicate
    const duplicate = await Registration.findOne({ eventId: event._id, email: normalizedEmail });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        error: "This email is already registered for this event",
        registration: duplicate,
      });
    }

    // 6. Generate QR code & create registration
    const ticketCode = generateTicketId();
    let finalQrCode = qrCodeDataUrl || "";
    if (!finalQrCode) {
      try {
        finalQrCode = await QRCode.toDataURL(
          JSON.stringify({
            ticketId: ticketCode,
            eventId: event._id,
            attendee: applicantName,
            email: normalizedEmail,
            eventTitle: event.title,
            issuer: "GDG on Campus FIEM",
          }),
          { width: 280, margin: 2 }
        );
      } catch (qrErr) {
        console.error("Server QR code generation failed:", qrErr);
      }
    }

    const registration = new Registration({
      eventId: event._id,
      registrationId: ticketCode,
      fullName: applicantName,
      email: normalizedEmail,
      phone: cleanPhone,
      college: college.trim(),
      department: department?.trim() || "Computer Science & Engineering",
      yearOfStudy: applicantYear,
      experienceLevel: experienceLevel || "Intermediate",
      qrCodeDataUrl: finalQrCode,
      status: "confirmed",
      checkedIn: false,
    });

    await registration.save();

    // 7. Decrement seats on the event
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registrationCount: 1 },
    });

    // 8. Return populated registration
    const populated = await Registration.findById(registration._id)
      .populate("eventId", "title slug displayDate startTime endTime venue address type")
      .lean();

    return res.status(201).json({
      success: true,
      message: "RSVP confirmed! 🎉",
      registration: populated,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    return res.status(500).json({ success: false, error: "RSVP failed", details: err.message });
  }
}

/**
 * GET /api/rsvp/:registrationId
 * Fetch a single registration by ticket ID or Mongo _id
 */
export async function getRSVP(req, res) {
  try {
    const { registrationId } = req.params;
    const registration = await Registration.findOne({
      $or: [{ registrationId }, { _id: registrationId }],
    }).populate("eventId");

    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    return res.json({ success: true, registration });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch registration", details: err.message });
  }
}

/**
 * GET /api/rsvp
 * List all registrations across all events
 */
export async function getAllRegistrations(req, res) {
  try {
    const list = await Registration.find()
      .populate("eventId", "title slug displayDate startTime endTime venue address type")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, count: list.length, registrations: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch registrations", details: err.message });
  }
}

/**
 * GET /api/rsvp/event/:eventId
 * List all registrations for a given event (admin use)
 */
export async function getEventRegistrations(req, res) {
  try {
    const list = await Registration.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    return res.json({ success: true, count: list.length, registrations: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch registrations", details: err.message });
  }
}

/**
 * PATCH /api/rsvp/:registrationId/checkin
 * Mark an attendee as checked in at the venue
 */
export async function checkInAttendee(req, res) {
  try {
    const { registrationId } = req.params;
    const registration = await Registration.findOneAndUpdate(
      { $or: [{ registrationId }, { _id: registrationId }] },
      { $set: { checkedIn: true, checkedInAt: new Date(), status: "checked_in" } },
      { new: true }
    ).populate("eventId", "title venue displayDate");

    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    return res.json({ success: true, message: "Attendee checked in ✅", registration });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Check-in failed", details: err.message });
  }
}
