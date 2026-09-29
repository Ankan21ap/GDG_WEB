import Event from "../models/event.js";

/**
 * GET /api/events
 * List all events with optional filters: status, category, search
 */
export async function getEvents(req, res) {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.type = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(filter).sort({
      date: status === "past" ? -1 : 1,
    });

    return res.json({ success: true, count: events.length, events });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch events", details: err.message });
  }
}

/**
 * GET /api/events/:slug
 * Get a single event by its URL slug
 */
export async function getEventBySlug(req, res) {
  try {
    const event = await Event.findOne({ slug: req.params.slug });

    if (!event) {
      return res.status(404).json({ success: false, error: `Event '${req.params.slug}' not found` });
    }

    return res.json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to retrieve event", details: err.message });
  }
}

/**
 * POST /api/events
 * Create a new event
 * Required body fields: title, slug, description, type, date, venue, capacity
 */
export async function createEvent(req, res) {
  try {
    const { title, slug, description, type, date, venue, capacity } = req.body;

    // Required field validation
    if (!title || !slug || !description || !type || !date || !venue || !capacity) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, slug, description, type, date, venue, capacity",
      });
    }

    // Check for duplicate slug
    const existing = await Event.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, error: `An event with slug '${slug}' already exists` });
    }

    const event = new Event({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      type,
      date: new Date(date),
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",
      venue: venue.trim(),
      address: req.body.address || "",
      capacity: Number(capacity),
      image: req.body.image || "",
      status: req.body.status || "upcoming",
      registrationOpen: req.body.registrationOpen ?? true,
    });

    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully ✅",
      event,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    return res.status(500).json({ success: false, error: "Failed to create event", details: err.message });
  }
}

/**
 * PATCH /api/events/:slug
 * Update an existing event by slug (partial update)
 */
export async function updateEvent(req, res) {
  try {
    const event = await Event.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    return res.json({ success: true, message: "Event updated", event });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to update event", details: err.message });
  }
}

/**
 * DELETE /api/events/:slug
 * Delete an event by slug
 */
export async function deleteEvent(req, res) {
  try {
    const event = await Event.findOneAndDelete({ slug: req.params.slug });

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    return res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to delete event", details: err.message });
  }
}
