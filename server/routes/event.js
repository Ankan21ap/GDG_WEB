import express from "express";
import { getEvents, getEventBySlug, createEvent, updateEvent, deleteEvent } from "../controllers/event.js";

const router = express.Router();

router.get("/", getEvents);           // GET  /api/events
router.get("/:slug", getEventBySlug); // GET  /api/events/:slug
router.post("/", createEvent);        // POST /api/events
router.patch("/:slug", updateEvent);  // PATCH /api/events/:slug
router.delete("/:slug", deleteEvent); // DELETE /api/events/:slug

export default router;
