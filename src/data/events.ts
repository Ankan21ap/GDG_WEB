import { Event } from "../types";
import { demoSpeakers } from "./speakers";

export const allEvents: Event[] = [
  {
    id: "evt-ai-build-day-2026",
    title: "AI Build Day 2026",
    slug: "ai-build-day-2026",
    shortDescription: "A full-day immersive hands-on workshop on building and deploying generative AI agents and multimodal web applications.",
    fullDescription: "Join GDG on Campus FIEM for AI Build Day 2026! Dive deep into the latest Google developer technologies, explore Gemini Multimodal APIs, build autonomous code assistants, and collaborate in teams during our afternoon hands-on sprint. Whether you are curious about prompt engineering or architecting distributed RAG systems, this event gives you practical code, industry mentors, and certified achievement passes.",
    type: "Workshop",
    category: "AI",
    date: "2026-10-20T10:00:00.000Z",
    displayDate: "20 October 2026",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    venue: "Main Auditorium, FIEM Campus",
    address: "Future Institute of Engineering and Management, Sonarpur Station Rd, Kolkata, West Bengal 700150",
    mapCoordinates: { lat: 22.4414, lng: 88.4239 },
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    ],
    speakers: [demoSpeakers[0], demoSpeakers[2], demoSpeakers[4]],
    agenda: [
      {
        id: "ag-1",
        time: "10:00 AM",
        duration: "30 mins",
        title: "Registration & Welcome Kit",
        speakerName: "GDG FIEM Core Team",
        description: "Check-in at the registration desk, collect your badge, sticker packs, and exclusive developer credentials.",
        tag: "Check-in"
      },
      {
        id: "ag-2",
        time: "10:30 AM",
        duration: "30 mins",
        title: "Opening Keynote & GDG Vision",
        speakerId: "spk-5",
        speakerName: "Rohit Paul",
        description: "Welcome address highlighting GDG on Campus FIEM's roadmap, Google Developer initiatives, and tech community milestones.",
        tag: "Keynote"
      },
      {
        id: "ag-3",
        time: "11:00 AM",
        duration: "120 mins",
        title: "AI Workshop: Building Multimodal Agents",
        speakerId: "spk-1",
        speakerName: "Arjun Sen",
        description: "Deep dive into Gemini 2.5/Flash, Function Calling, multimodal audio/vision pipelines, and building production-ready apps with Next.js & React.",
        tag: "Technical Session"
      },
      {
        id: "ag-4",
        time: "01:00 PM",
        duration: "60 mins",
        title: "Lunch & Peer Networking",
        speakerName: "All Attendees & Mentors",
        description: "Delicious lunch provided on campus. Meet mentors, discuss project ideas, and form teams for the afternoon challenge.",
        tag: "Networking"
      },
      {
        id: "ag-5",
        time: "02:00 PM",
        duration: "120 mins",
        title: "Hands-on AI Sprint Challenge",
        speakerName: "Mentors & Leads",
        description: "Build an interactive AI project in small teams with live mentor guidance. Top solutions win Google swag and interview spotlight vouchers.",
        tag: "Hack Challenge"
      },
      {
        id: "ag-6",
        time: "04:00 PM",
        duration: "30 mins",
        title: "Closing Remarks, Awards & Certificates",
        speakerId: "spk-5",
        speakerName: "Core Committee",
        description: "Presentation of team solutions, awarding winners, and distribution of official digital participation credentials.",
        tag: "Ceremony"
      }
    ],
    status: "upcoming",
    registrationOpen: true,
    totalSeats: 150,
    seatsRemaining: 34,
    prerequisites: [
      "Basic familiarity with JavaScript/TypeScript or Python",
      "Curiosity about generative AI and web development",
      "A GitHub account (recommended for sharing code during the sprint)"
    ],
    whatToBring: [
      "Your laptop and charger",
      "College ID card for campus entry",
      "Pre-installed Node.js (v18+) or Python 3.10+"
    ],
    whatYouWillLearn: [
      "How to orchestrate Google GenAI multimodal prompts with live schemas",
      "Implementing real-time tool calling and web integration in TypeScript",
      "Best practices for latency optimization and streaming responses",
      "Collaborating on git repositories with cross-functional campus teams"
    ],
    faqs: [
      {
        question: "Who can attend this event?",
        answer: "The event is open to all students of FIEM as well as passionate student developers from neighboring engineering institutes."
      },
      {
        question: "Is the event free to join?",
        answer: "Yes, all GDG on Campus FIEM events are 100% free of charge, supported by Google Developer Groups community initiatives."
      },
      {
        question: "Do I need prior deep learning experience?",
        answer: "No advanced machine learning background is required. We start from modern API foundations before progressing to hands-on agent building."
      },
      {
        question: "Will participation certificates be provided?",
        answer: "Yes, verified digital certificates will be issued to all registered participants who attend the complete workshop."
      }
    ]
  },
  {
    id: "evt-cloud-vertex-bootcamp",
    title: "Google Cloud & Vertex AI Bootcamp",
    slug: "cloud-vertex-ai-bootcamp-2026",
    shortDescription: "Master cloud-native architecture, containerization on Cloud Run, and managed ML pipelines with Google Cloud.",
    fullDescription: "An intensive half-day masterclass on modern cloud infrastructure. Learn how to containerize web apps, scale with zero infrastructure overhead on Google Cloud Run, and integrate managed Vertex AI models into scalable backends.",
    type: "Workshop",
    category: "Cloud",
    date: "2026-11-14T10:00:00.000Z",
    displayDate: "14 November 2026",
    startTime: "10:30 AM",
    endTime: "03:30 PM",
    venue: "Lab 3 & Seminar Hall, FIEM Campus",
    address: "Future Institute of Engineering and Management, Kolkata",
    mapCoordinates: { lat: 22.4414, lng: 88.4239 },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[1], demoSpeakers[2]],
    agenda: [
      {
        id: "c-1",
        time: "10:30 AM",
        duration: "30 mins",
        title: "Registration & Cloud Credits Setup",
        description: "Activation of Google Cloud free credits sandbox accounts for all participants.",
        tag: "Setup"
      },
      {
        id: "c-2",
        time: "11:00 AM",
        duration: "90 mins",
        title: "Deploying Containerized Microservices on Cloud Run",
        speakerName: "Priya Mukherjee",
        description: "From Dockerfile to global serverless deployment with CI/CD GitHub Actions.",
        tag: "Hands-on"
      },
      {
        id: "c-3",
        time: "01:00 PM",
        duration: "45 mins",
        title: "Lunch & Cloud Career Q&A",
        description: "Ask experienced cloud architects about certifications, interview prep, and distributed systems.",
        tag: "Discussion"
      },
      {
        id: "c-4",
        time: "01:45 PM",
        duration: "90 mins",
        title: "Vertex AI Pipelines & Model Tuning",
        speakerName: "Devratna Banerjee",
        description: "Deploying enterprise embeddings and vector search in Google Cloud.",
        tag: "Technical Session"
      }
    ],
    status: "upcoming",
    registrationOpen: true,
    totalSeats: 120,
    seatsRemaining: 18,
    prerequisites: ["Basic command line understanding", "A Google account to claim cloud labs credits"],
    whatToBring: ["Laptop with Chrome browser and power adapter"],
    whatYouWillLearn: [
      "Serverless architecture patterns on Google Cloud",
      "Secrets management and production IAM roles",
      "Deploying and monitoring scalable containers"
    ],
    faqs: [
      {
        question: "Do I need a credit card for Google Cloud credits?",
        answer: "No, attendees receive temporary sandbox access passes specifically created for the workshop without needing personal billing."
      }
    ]
  },
  {
    id: "evt-android-compose-sprint",
    title: "Android Compose & Modern Web Sprint",
    slug: "android-compose-modern-web-sprint",
    shortDescription: "Build declarative UIs with Jetpack Compose and integrate reactive web APIs with modern state management.",
    fullDescription: "Experience the synergy between modern Android UI engineering with Jetpack Compose and modern reactive web development. Hands-on coding session covering Material Design 3, animations, and Kotlin Multiplatform fundamentals.",
    type: "Study Jam",
    category: "Android",
    date: "2026-12-05T11:00:00.000Z",
    displayDate: "05 December 2026",
    startTime: "11:00 AM",
    endTime: "04:30 PM",
    venue: "CSE Department Seminar Room, FIEM",
    address: "Future Institute of Engineering and Management, Kolkata",
    mapCoordinates: { lat: 22.4414, lng: 88.4239 },
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[3], demoSpeakers[4]],
    agenda: [
      {
        id: "a-1",
        time: "11:00 AM",
        duration: "45 mins",
        title: "Declarative UI Fundamentals in Compose",
        speakerName: "Sneha Roy Chowdhury",
        description: "Recomposition, state hoisting, and reactive UI architecture.",
        tag: "Session"
      },
      {
        id: "a-2",
        time: "12:00 PM",
        duration: "90 mins",
        title: "Live Coding: Building a Real-time Community App",
        speakerName: "Sneha & Team",
        description: "Constructing responsive screens, fluid animations, and HTTP network clients.",
        tag: "Workshop"
      },
      {
        id: "a-3",
        time: "02:00 PM",
        duration: "120 mins",
        title: "Mini Hack: Build & Publish",
        description: "Ship an interactive feature and demo live to the community.",
        tag: "Challenge"
      }
    ],
    status: "upcoming",
    registrationOpen: true,
    totalSeats: 90,
    seatsRemaining: 42,
    prerequisites: ["Android Studio installed or basic Java/Kotlin experience"],
    whatToBring: ["Laptop with Android Studio Ladybug or newer"],
    whatYouWillLearn: [
      "State hoisting and reactive Compose trees",
      "Material 3 design theming and dynamic color schemes",
      "Connecting modern REST/GraphQL endpoints"
    ]
  },
  // PAST EVENTS
  {
    id: "evt-devfest-fiem-2025",
    title: "DevFest FIEM 2025: Horizons of Code",
    slug: "devfest-fiem-2025",
    shortDescription: "Our flagship annual technology conference bringing together 450+ students, 12 industry speakers, and 6 technical tracks.",
    fullDescription: "DevFest FIEM 2025 was our largest on-campus celebration of developer technology to date. Featuring parallel tracks across Generative AI, Cloud Infrastructure, Web Architecture, and Open Source careers, students networked with leading technologists, participated in live demos, and collected exclusive swag.",
    type: "Conference",
    category: "AI",
    date: "2025-11-28T09:30:00.000Z",
    displayDate: "28 November 2025",
    startTime: "09:30 AM",
    endTime: "05:30 PM",
    venue: "Main Campus Auditorium, FIEM",
    address: "Future Institute of Engineering and Management, Kolkata",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[0], demoSpeakers[1], demoSpeakers[2], demoSpeakers[3]],
    agenda: [
      { id: "df-1", time: "09:30 AM", title: "Registrations & Welcome Keynote", description: "Inaugural address and lighting of the tech lamp." },
      { id: "df-2", time: "11:00 AM", title: "Track A: AI & LLM Systems | Track B: Cloud Scalability", description: "Dual-track sessions by Google Developer Experts." },
      { id: "df-3", time: "01:30 PM", title: "Networking Lunch & Project Showcase", description: "Student exhibition of campus-built developer tools." },
      { id: "df-4", time: "03:00 PM", title: "Panel Discussion: Career in Big Tech & Startups", description: "Q&A with engineering leaders." },
      { id: "df-5", time: "04:30 PM", title: "Hack Prize Ceremony & GDG Community Honors", description: "Recognizing outstanding student contributors." }
    ],
    status: "past",
    registrationOpen: false,
    attendeesCount: 460,
    outcomes: [
      { metric: "460+", label: "Student Attendees" },
      { metric: "12", label: "Industry Keynotes" },
      { metric: "35+", label: "Projects Showcased" },
      { metric: "100%", label: "Free & Open Access" }
    ],
    highlights: [
      "Keynote by Google Developer Expert on enterprise generative AI workflows",
      "Interactive coding corner with instant code review by industry leads",
      "Over 40 students landed internship referrals through the networking pavilion",
      "Launch of the GDG FIEM Open Source Repository incubator"
    ]
  },
  {
    id: "evt-solution-challenge-hackathon-2025",
    title: "Google Solution Challenge: FIEM Hackathon",
    slug: "solution-challenge-hackathon-2025",
    shortDescription: "A 24-hour campus hackathon solving United Nations 17 Sustainable Development Goals using Google tech.",
    fullDescription: "Teams developed end-to-end applications tackling clean energy, healthcare accessibility, and quality education. With continuous mentor check-ins and late-night pizza coding, 28 prototype solutions were submitted.",
    type: "Hackathon",
    category: "Hackathon",
    date: "2025-08-15T09:00:00.000Z",
    displayDate: "15-16 August 2025",
    startTime: "09:00 AM",
    endTime: "09:00 AM (24H)",
    venue: "Central Computing Center, FIEM",
    address: "Future Institute of Engineering and Management, Kolkata",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[1], demoSpeakers[4]],
    agenda: [
      { id: "sc-1", time: "09:00 AM", title: "Problem Statement Release & Team Formations", description: "UN SDG alignment overview." },
      { id: "sc-2", time: "02:00 PM", title: "Mentor Round 1: Architecture Review", description: "Technical viability assessment by visiting engineers." },
      { id: "sc-3", time: "11:00 PM", title: "Midnight Coding Jam & Lightning Quiz", description: "Energizer games and snacks." },
      { id: "sc-4", time: "08:00 AM", title: "Final Pitch Deck & Live Product Demos", description: "Jury scoring based on impact, UX, and technical execution." }
    ],
    status: "past",
    registrationOpen: false,
    attendeesCount: 180,
    outcomes: [
      { metric: "28", label: "Prototypes Built" },
      { metric: "180+", label: "Hackers Participated" },
      { metric: "₹50,000", label: "Prize Pool Distributed" },
      { metric: "3", label: "Global Top 100 Shortlists" }
    ],
    highlights: [
      "First prize awarded to 'EcoRoute', an AI-powered carbon footprint optimizer for urban commute",
      "Runner-up built 'EduSign', real-time sign language interpreter using WebGL and MediaPipe",
      "Special mention for best zero-cost serverless deployment on Google Cloud"
    ]
  },
  {
    id: "evt-flutter-firebase-deepdive",
    title: "Flutter & Firebase: Cross-Platform Mastery",
    slug: "flutter-firebase-deep-dive",
    shortDescription: "Building production-grade iOS & Android applications from a single codebase with cloud databases.",
    fullDescription: "Students created a complete social discovery application in 4 hours, utilizing Flutter 3.x, Riverpod state management, and Firebase Auth with Cloud Firestore real-time listeners.",
    type: "Workshop",
    category: "Android",
    date: "2025-05-10T10:00:00.000Z",
    displayDate: "10 May 2025",
    startTime: "10:00 AM",
    endTime: "03:00 PM",
    venue: "Room 402, Technology Block, FIEM",
    address: "Future Institute of Engineering and Management, Kolkata",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[3]],
    agenda: [
      { id: "ff-1", time: "10:00 AM", title: "Dart & Flutter Architecture Foundations", description: "Widget lifecycle and widget composition." },
      { id: "ff-2", time: "11:30 AM", title: "Firebase Integration: Auth, Storage & Security Rules", description: "Live backend provisioning and rule enforcement." },
      { id: "ff-3", time: "01:30 PM", title: "Offline Persistence & State Management", description: "Riverpod providers and responsive layout builders." }
    ],
    status: "past",
    registrationOpen: false,
    attendeesCount: 130,
    outcomes: [
      { metric: "130+", label: "Attendees" },
      { metric: "85+", label: "Live Apps Deployed" },
      { metric: "4.9/5", label: "Feedback Rating" }
    ],
    highlights: [
      "Over 85 live apps tested on physical devices during the lab session",
      "Hands-on demo of Firebase Remote Config and Analytics",
      "Interactive speed-debugging round with rewards"
    ]
  },
  {
    id: "evt-career-summit-campus-to-industry",
    title: "Tech Career Summit: Campus to Industry",
    slug: "career-summit-campus-to-industry",
    shortDescription: "A panel discussion and resume masterclass on breaking into product companies, open source, and remote roles.",
    fullDescription: "Demystifying tech interviews, system design rounds, open-source portfolio building, and cold outreach. Senior engineers from top MNCs and high-growth startups shared actionable career roadmaps.",
    type: "Speaker Session",
    category: "Career",
    date: "2025-03-22T14:00:00.000Z",
    displayDate: "22 March 2025",
    startTime: "02:00 PM",
    endTime: "05:30 PM",
    venue: "FIEM Main Auditorium",
    address: "Future Institute of Engineering and Management, Kolkata",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    speakers: [demoSpeakers[0], demoSpeakers[2]],
    agenda: [
      { id: "cs-1", time: "02:00 PM", title: "The Modern Engineering Hiring Landscape", description: "What product companies actually look for beyond DSA." },
      { id: "cs-2", time: "03:15 PM", title: "Live Resume & GitHub Teardown", description: "Reviewing student portfolios live on stage with real-time feedback." },
      { id: "cs-3", time: "04:30 PM", title: "Ask Us Anything & 1:1 Mentorship", description: "Open mic career guidance session." }
    ],
    status: "past",
    registrationOpen: false,
    attendeesCount: 320,
    outcomes: [
      { metric: "320+", label: "Participants" },
      { metric: "40+", label: "Resumes Reviewed" },
      { metric: "15+", label: "Mock Interviews Conducted" }
    ],
    highlights: [
      "Interactive resume roast and rebuild session that helped 15 students revamp their portfolios",
      "Actionable roadmap for open-source contributions to Google Summer of Code (GSoC)",
      "Dedicated networking circles organized by career interests"
    ]
  }
];

export const getUpcomingEvents = () => allEvents.filter(e => e.status === "upcoming");
export const getPastEvents = () => allEvents.filter(e => e.status === "past");
export const getEventBySlug = (slug: string) => allEvents.find(e => e.slug === slug || e.id === slug);
