/**
 * Single source of truth for the portfolio's personal data.
 *
 * The chat system prompt (src/app/api/chat/prompt.ts) and every profile-ish
 * component read from here, so the AI answers and the rendered cards can never
 * drift apart.
 *
 * EMPTY BY DESIGN. Fill in only what is true — anything left blank is simply
 * absent from the site, and the prompt instructs the model to say it doesn't
 * know rather than invent a value. Never add a fact here you would not publish.
 */

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ExperienceRole {
  position: string;
  duration: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  /** Set when the same employer covered several titles over time. */
  roles?: ExperienceRole[];
  location: string;
  duration: string;
  type: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  duration: string;
}

export interface ResumeProject {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const RESUME = {
  name: 'Rimon Ahammad',
  title: 'Software Engineer',
  headline:
    'Full-Stack: Flutter Mobile & Desktop + Rust Production Backend | Raw FFI + Protobuf',
  location: 'Dhaka, Bangladesh',
  email: 'nextr71@gmail.com',
  /** Not rendered anywhere; it only reaches the chat model, which is told to give it out only on direct request. */
  phone: '+88 01627640412',
  github: 'https://github.com/RemonAhammad',
  githubUsername: 'RemonAhammad',
  linkedin: 'https://bd.linkedin.com/in/remonahammad',
  telegram: '',

  summary:
    'Senior Software Engineer with 5+ years of Flutter cross-platform development and 2.5+ years shipping Rust in production. I build end-to-end systems pairing Rust backends — Axum REST APIs, WebSockets, gRPC, libp2p P2P, media processing — with Flutter frontends connected via FFI, plus Rust compiled to WASM for browser targets. Specialized in real-time communications: WebRTC signaling, SDP negotiation, and TURN/STUN NAT traversal. Deep Flutter UI engineering across responsive web/mobile, custom widgets, animation-rich UX, and multiple state-management patterns. Working knowledge of Go, Java, C/C++, and Assembly.',

  // Not on the CV — these drive the UI pills and the landing-page greeting.
  // Every one is backed by the skills and experience below.
  tags: ['Rust', 'Flutter', 'FFI', 'WebRTC', 'Full-Stack', 'Cross-Platform'],

  skills: [
    {
      category: 'Rust',
      skills: [
        'tokio', 'axum', 'actix-web', 'rocket', 'tonic', 'serde', 'sqlx', 'prost', 'sled',
        'OpenCV', 'async programming', 'multi-threading', 'concurrency', 'Tauri v2',
        'custom crates', 'testing', 'platform-specific implementations',
      ],
    },
    {
      category: 'Flutter & Dart',
      skills: [
        'Riverpod', 'Provider', 'Clean Architecture', 'GoRouter', 'Freezed', 'dart:ffi',
        'custom widgets', 'custom paint', 'animations', 'isolates', 'method channels',
        'Material 3', 'responsive UI design', 'Wear OS',
      ],
    },
    {
      category: 'FFI & Interop',
      skills: [
        'dart:ffi', 'Cargokit', 'Protobuf', 'platform channels', 'flutter_rust_bridge',
        'raw FFI experiments', 'cross-language bindings',
      ],
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL (SQLx)', 'ClickHouse', 'MySQL', 'SQLite', 'Sled', 'Isar', 'NoSQL stores'],
    },
    {
      category: 'Real-Time & Networking',
      skills: [
        'WebRTC (signaling, SDP, STUN/TURN/CoTURN)', 'WebSocket (tokio-tungstenite)',
        'libp2p (P2P/pubsub)', 'gRPC/Protobuf', 'Tonic',
      ],
    },
    {
      category: 'Cross-Platform',
      skills: [
        'Android', 'iOS', 'Web', 'Desktop (Tauri v2)', 'Wear OS', 'Linux', 'macOS',
        'Windows from a single Rust core', 'Wasm',
      ],
    },
    {
      category: 'Tooling',
      skills: ['Git', 'Docker', 'Azure Blob Storage', 'Firebase (Auth, FCM, Storage)', 'CoTURN', 'Cargokit'],
    },
  ] as SkillGroup[],

  experience: [
    {
      id: 'akij-ibos',
      company: 'AKIJ iBOS',
      position: 'Senior Software Engineer',
      location: 'Dhaka, Bangladesh',
      duration: 'Feb 2025 — Present',
      type: 'Full-time',
      summary:
        'Building two production Rust platforms: TrackForce, a cross-platform employee productivity and time-tracking platform with a Rust backend and Tauri clients, and an internal Support & Ticketing Platform (multi-tenant SaaS, axum + Leptos WASM).',
      highlights: [
        'Architected Rust + Axum API (hexagonal layout over ClickHouse OLAP), 45+ REST endpoints + WebSocket streaming, bulk time-entry upsert, daily reports, top-performer ranking, dashboard analytics, OCR, and Azure Blob screenshot galleries.',
        'Delivered TrackForce Desktop on Tauri v2 — monitoring, screenshots, tray, and updater for macOS (signed/notarized DMG), Windows, and Linux from one Rust codebase.',
        'Implemented cross-platform activity monitoring (mouse, keyboard, screenshots, app history), including Wayland keyboard.',
        'Architected the internal Support & Ticketing Platform in pure Rust: axum + Leptos WASM SPA, PostgreSQL/sqlx, argon2, WebSocket-driven live chat with an embeddable widget for external visitors, and organizations with per-org RBAC.',
        'Shipped supporting projects on the platform: Akij Air Mobile (Flutter), Akij Air Search (Rust/gRPC), Remote Desktop (Rust/WebRTC), and Face Auth (Rust).',
      ],
      technologies: [
        'Rust', 'tokio', 'axum', 'Leptos', 'sqlx', 'PostgreSQL', 'ClickHouse', 'Tauri v2',
        'Sled', 'prost', 'argon2', 'Azure Blob', 'WebSocket', 'gRPC', 'Flutter',
      ],
    },
    {
      id: 'remote-client',
      company: 'Remote Client',
      position: 'Senior Software Engineer',
      location: 'Remote',
      duration: 'Feb 2024 — Present',
      type: 'Contract',
      summary:
        'Architecting a multi-tenant restaurant ordering and operations platform: Flutter mobile/desktop clients and Rust backend services.',
      highlights: [
        'Slideshow Platform (Rust + Flutter) — a real-time slide distribution system: Rust WebSocket backend (Axum + tokio-tungstenite), Flutter admin UI for slide management, Flutter display frontend, and a reusable slideshow_core Flutter package for slide rendering.',
        'Account Management App (Flutter + Rust) — an enterprise multi-platform Flutter app (Mobile, Desktop) with 18 feature modules covering brands, regions, roles, schedules, stores, plans and permissions. Built on Riverpod 2.5 with codegen, Go Router 14, Freezed 3, JWT-based auth, and a companion Rust backend server.',
        'Built a Rust reporting engine paired with a Flutter dashboard UI, surfacing real-time order, inventory, and staff metrics for multi-tenant store operators.',
        'Built front-of-house operations packages like inventory tracking and customer waitlist modules used across mobile and desktop clients.',
        'Engineered a Flutter WebRTC video calling stack with real-time signaling, group call, and screen-sharing support over a self-hosted media server.',
        "Delivered a shared design system package powering the platform's UI: shared widgets, themes, and layouts consumed by every Flutter client.",
        'Implemented a location-triggered notification module firing geofence-based alerts when staff or customers cross defined boundaries; plus supporting Flutter packages across the suite (marketing UI, party booking, FCM, Twilio + native SMS).',
      ],
      technologies: [
        'Rust', 'tokio', 'Flutter', 'Dart', 'Riverpod', 'Multi Threading', 'dart:ffi',
        'Protobuf', 'FCM', 'Twilio',
      ],
    },
    {
      id: 'algorithm-generation',
      company: 'Algorithm Generation Limited',
      position: 'Senior Software Engineer',
      roles: [
        { position: 'Senior Software Engineer', duration: 'Jul 2024 — Jan 2025' },
        { position: 'Software Engineer', duration: 'Jul 2023 — Jun 2024' },
        { position: 'Junior Software Engineer', duration: 'Jul 2022 — Jun 2023' },
        { position: 'Apprentice', duration: 'Nov 2021 — Jun 2022' },
      ],
      location: 'Dhaka, Bangladesh',
      duration: 'Nov 2021 — Jan 2025',
      type: 'Full-time',
      summary: 'Grew from apprentice to senior engineer, shipping Flutter products and decentralized Rust services.',
      highlights: [
        'Chat App — a decentralized real-time messaging app built with Rust libp2p (pubsub) and Flutter, enabling peer-to-peer communication without centralized servers.',
        'BBQ Tonight — a scalable multi-role food delivery SaaS platform built with Flutter, supporting customer, admin, and delivery operations with real-time order management.',
        'GariBook — a ride-hailing app with separate Client and Driver apps built with Flutter for booking and managing trips.',
        'Probashi, Sadaqatul Zakat, and contributions to modules for other projects.',
      ],
      technologies: ['Flutter', 'Dart', 'Rust', 'libp2p', 'WebSocket', 'REST APIs', 'Firebase', 'Riverpod'],
    },
    {
      id: 'codwin-it',
      company: 'Codwin IT',
      position: 'Apprentice',
      location: 'Dhaka, Bangladesh',
      duration: 'Jul 2021 — Oct 2021',
      type: 'Apprenticeship',
      summary:
        'E-Treatment (Flutter) — a medical support platform with a Patient App, a Doctor App and a Pharmacy App.',
      highlights: [],
      technologies: ['Flutter', 'Dart'],
    },
  ] as ExperienceEntry[],

  education: [
    {
      degree: 'Bachelor of Science in CSE',
      institution: 'Green University of Bangladesh',
      location: 'Dhaka',
      duration: 'Feb 2022 — 2026',
    },
    {
      degree: 'Diploma in Engineering (Computer)',
      institution: 'Faridpur Polytechnic Institute',
      location: 'Faridpur, Dhaka',
      duration: 'Aug 2016 — May 2020',
    },
    {
      degree: 'Secondary School Certificate',
      institution: 'Manikganj Technical School & College',
      location: 'Manikganj, Dhaka',
      duration: 'Jan 2014 — Mar 2016',
    },
  ] as EducationEntry[],

  projects: [
    {
      title: 'Gym ERP Suite',
      category: 'Full-Stack',
      description:
        'End-to-end business platform with a Rust backend, a Flutter cross-platform app, and a web frontend for purchasing application subscriptions.',
      technologies: ['Flutter', 'Rust', 'Axum', 'PostgreSQL', 'Web'],
    },
    {
      title: 'Flutter-Rust Integration (FFI)',
      category: 'Interop',
      description:
        'Cross-language FFI experiments for safe Rust ↔ Dart bindings and platform channel messaging: Flutter-Rust-FFI, flutter_rust_bridge_practice, rust_ffi_plugin_with_cargokit, flutter_rust_message_channel.',
      technologies: ['Dart', 'Rust', 'dart:ffi', 'Cargokit', 'flutter_rust_bridge'],
      githubUrl: 'https://github.com/RemonAhammad/Flutter-Rust-FFI',
    },
    {
      title: 'Textile Platform',
      category: 'Full-Stack',
      description:
        'Multi-application ecosystem with backend APIs. Implements role-based access control, operational dashboards, and data management tools across the full stack.',
      technologies: ['Backend', 'Web', 'Admin', 'RBAC'],
    },
    {
      title: 'fuel_cost',
      category: 'Full-Stack',
      description:
        'End-to-end fuel tracking platform delivered solo: Rust + Axum REST API, web dashboard, and Flutter Material 3 client.',
      technologies: ['Rust', 'Axum', 'Flutter', 'Material 3', 'Web'],
      githubUrl: 'https://github.com/RemonAhammad/fuel_cost',
    },
    {
      title: 'animation_search_bar',
      category: 'Flutter Package',
      description:
        'Published Flutter package on pub.dev. Customizable animated search bar widget supporting all 6 Flutter platforms.',
      technologies: ['Flutter', 'Dart', 'pub.dev'],
      githubUrl: 'https://github.com/RemonAhammad/animation_search_bar',
      demoUrl: 'https://pub.dev/packages/animation_search_bar',
    },
    {
      title: 'AI Caption Generator',
      category: 'Mobile / AI',
      description:
        'Released Flutter app that turns any photo into 3 ready-to-post social-media captions and a curated hashtag set.',
      technologies: ['Flutter', 'Google Gemini Vision'],
    },
    {
      title: 'Rust Tooling',
      category: 'Systems',
      description:
        'Cross-platform screenshot capture and structured logging. Image/media processing: OpenCV integration, blurhash encoding. Cryptography: Rust encryption/decryption implementations.',
      technologies: ['Rust', 'OpenCV', 'blurhash', 'cryptography'],
    },
  ] as ResumeProject[],
};
