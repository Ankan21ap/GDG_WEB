import express from "express";
import { createRSVP, getAllRegistrations, getRSVP, getEventRegistrations, checkInAttendee } from "../controllers/rsvp.js";

const router = express.Router();

router.post("/", createRSVP);                              // POST  /api/rsvp
router.get("/", getAllRegistrations);                       // GET   /api/rsvp
router.get("/event/:eventId", getEventRegistrations);      // GET   /api/rsvp/event/:eventId
router.get("/:registrationId", getRSVP);                   // GET   /api/rsvp/:registrationId
router.patch("/:registrationId/checkin", checkInAttendee); // PATCH /api/rsvp/:registrationId/checkin

export default router;
