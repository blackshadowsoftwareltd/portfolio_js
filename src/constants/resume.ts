/**
 * Single source of truth for Rimon Ahammad's CV.
 *
 * The chat system prompt (src/app/api/chat/prompt.ts) and every profile-ish
 * component read from here, so the AI answers and the rendered cards can never
 * drift apart. Nothing in this file is estimated or filled in — if a fact isn't
 * on the CV it is simply absent, and the prompt tells the model to say so
 * rather than invent one.
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
  /**
   * On the CV, but deliberately not rendered anywhere public — the prompt only
   * hands it out when a visitor asks for it directly.
   */
  phone: '+88 01627640412',
  github: 'https://github.com/RemonAhammad',
  githubUsername: 'RemonAhammad',
  linkedin: 'https://bd.linkedin.com/in/remonahammad',
  telegram: 'https://t.me/remonahammad',

  summary:
    'Senior Software Engineer with 5+ years of Flutter cross-platform development and 2.5+ years shipping Rust in production. I build end-to-end systems that pair Rust backends — Axum REST APIs, WebSockets, gRPC, libp2p P2P, media processing — with Flutter frontends connected over FFI, plus Rust compiled to WASM for browser targets. Specialised in real-time communication: WebRTC signalling, SDP negotiation and TURN/STUN NAT traversal. Deep Flutter UI engineering across responsive web/mobile, custom widgets, animation-rich UX and several state-management patterns. Working knowledge of Go, Java, C/C++ and Assembly.',

  tags: ['Rust', 'Flutter', 'FFI', 'WebRTC', 'Full-Stack', 'Cross-Platform'],

  skills: [
    {
      category: 'Rust',
      skills: [
        'tokio',
        'axum',
        'actix-web',
        'rocket',
        'tonic',
        'serde',
        'sqlx',
        'prost',
        'sled',
        'OpenCV',
        'async programming',
        'multi-threading',
        'concurrency',
        'Tauri v2',
        'custom crates',
        'testing',
      ],
    },
    {
      category: 'Flutter & Dart',
      skills: [
        'Riverpod',
        'Provider',
        'Clean Architecture',
        'GoRouter',
        'Freezed',
        'dart:ffi',
        'custom widgets',
        'custom paint',
        'animations',
        'isolates',
        'method channels',
        'Material 3',
        'responsive UI',
        'Wear OS',
      ],
    },
    {
      category: 'FFI & Interop',
      skills: [
        'dart:ffi',
        'Cargokit',
        'Protobuf',
        'platform channels',
        'flutter_rust_bridge',
        'raw FFI',
        'cross-language bindings',
      ],
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL (SQLx)', 'ClickHouse', 'MySQL', 'SQLite', 'Sled', 'Isar', 'NoSQL stores'],
    },
    {
      category: 'Real-Time & Networking',
      skills: [
        'WebRTC (signalling, SDP, STUN/TURN/CoTURN)',
        'WebSocket (tokio-tungstenite)',
        'libp2p (P2P/pubsub)',
        'gRPC/Protobuf',
        'Tonic',
      ],
    },
    {
      category: 'Cross-Platform',
      skills: ['Android', 'iOS', 'Web', 'Desktop (Tauri v2)', 'Wear OS', 'Linux', 'macOS', 'Windows', 'WASM'],
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
        'Building two production Rust platforms: TrackForce, a cross-platform employee productivity and time-tracking product with a Rust backend and Tauri clients, and an internal multi-tenant Support & Ticketing SaaS (axum + Leptos WASM).',
      highlights: [
        'Architected the Rust + Axum API — a hexagonal layout over ClickHouse OLAP with 45+ REST endpoints and WebSocket streaming, bulk time-entry upsert, daily reports, top-performer ranking, dashboard analytics, OCR and Azure Blob screenshot galleries.',
        'Delivered TrackForce Desktop on Tauri v2 — monitoring, screenshots, tray and updater for macOS (signed/notarised DMG), Windows and Linux from one Rust codebase.',
        'Implemented cross-platform activity monitoring (mouse, keyboard, screenshots, app history) including Wayland keyboard support.',
        'Architected the internal Support & Ticketing Platform in pure Rust: axum + a Leptos WASM SPA, PostgreSQL/sqlx, argon2, WebSocket-driven live chat with an embeddable widget for external visitors, and organisations with per-org RBAC.',
        'Shipped supporting products on the platform: Akij Air Mobile (Flutter), Akij Air Search (Rust/gRPC), Remote Desktop (Rust/WebRTC) and Face Auth (Rust).',
      ],
      technologies: [
        'Rust',
        'tokio',
        'axum',
        'Leptos',
        'sqlx',
        'PostgreSQL',
        'ClickHouse',
        'Tauri v2',
        'Sled',
        'prost',
        'argon2',
        'Azure Blob',
        'WebSocket',
        'gRPC',
        'Flutter',
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
        'Architecting a multi-tenant restaurant ordering and operations platform: Flutter mobile/desktop clients backed by Rust services.',
      highlights: [
        'Slideshow Platform (Rust + Flutter) — real-time slide distribution: a Rust WebSocket backend (Axum + tokio-tungstenite), a Flutter admin UI for slide management, a Flutter display frontend and a reusable slideshow_core package for rendering.',
        'Account Management App (Flutter + Rust) — an enterprise multi-platform app (mobile, desktop) with 18 feature modules covering brands, regions, roles, schedules, stores, plans and permissions, on Riverpod 2.5 with codegen, Go Router 14, Freezed 3 and JWT auth, plus a companion Rust backend.',
        'Built a Rust reporting engine paired with a Flutter dashboard, surfacing real-time order, inventory and staff metrics for multi-tenant store operators.',
        'Built front-of-house packages — inventory tracking and a customer waitlist — used across the mobile and desktop clients.',
        'Engineered a Flutter WebRTC video-calling stack with real-time signalling, group calls and screen sharing over a self-hosted media server.',
        'Delivered the shared design-system package powering the suite: shared widgets, themes and layouts consumed by every Flutter client.',
        'Implemented a location-triggered notification module firing geofence alerts when staff or customers cross defined boundaries, plus supporting packages (marketing UI, party booking, FCM, Twilio + native SMS).',
      ],
      technologies: [
        'Rust',
        'tokio',
        'Flutter',
        'Dart',
        'Riverpod',
        'multi-threading',
        'dart:ffi',
        'Protobuf',
        'WebRTC',
        'FCM',
        'Twilio',
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
      summary:
        'Grew from apprentice to senior engineer over three years, shipping Flutter products and decentralised Rust services.',
      highlights: [
        'Chat App — a decentralised real-time messaging app built with Rust libp2p (pubsub) and Flutter, enabling peer-to-peer communication with no central server.',
        'BBQ Tonight — a scalable multi-role food-delivery SaaS in Flutter, supporting customer, admin and delivery operations with real-time order management.',
        'GariBook — a ride-hailing product with separate Client and Driver apps in Flutter for booking and managing trips.',
        'Probashi, Sadaqatul Zakat, and modules contributed to other products.',
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
        'E-Treatment (Flutter) — a medical support platform made up of a Patient app, a Doctor app and a Pharmacy app.',
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
        'End-to-end business platform: a Rust/Axum backend, a Flutter cross-platform app and a web frontend for purchasing application subscriptions.',
      technologies: ['Rust', 'Axum', 'PostgreSQL', 'Flutter', 'Web'],
    },
    {
      title: 'Flutter ↔ Rust FFI',
      category: 'Interop',
      description:
        'Cross-language FFI experiments for safe Rust ↔ Dart bindings and platform-channel messaging, across four repos: Flutter-Rust-FFI, flutter_rust_bridge_practice, rust_ffi_plugin_with_cargokit and flutter_rust_message_channel.',
      technologies: ['Rust', 'Dart', 'dart:ffi', 'Cargokit', 'flutter_rust_bridge', 'Protobuf'],
      githubUrl: 'https://github.com/RemonAhammad/Flutter-Rust-FFI',
    },
    {
      title: 'fuel_cost',
      category: 'Full-Stack',
      description:
        'End-to-end fuel-tracking platform delivered solo: a Rust + Axum REST API, a web dashboard and a Flutter Material 3 client.',
      technologies: ['Rust', 'Axum', 'Flutter', 'Material 3', 'Web'],
      githubUrl: 'https://github.com/RemonAhammad/fuel_cost',
    },
    {
      title: 'animation_search_bar',
      category: 'Flutter Package',
      description:
        'Published Flutter package on pub.dev: a customisable animated search-bar widget supporting all six Flutter platforms.',
      technologies: ['Flutter', 'Dart', 'pub.dev'],
      githubUrl: 'https://github.com/RemonAhammad/animation_search_bar',
      demoUrl: 'https://pub.dev/packages/animation_search_bar',
    },
    {
      title: 'Textile Platform',
      category: 'Full-Stack',
      description:
        'Multi-application ecosystem with backend APIs, role-based access control, operational dashboards and data-management tools across the full stack.',
      technologies: ['Rust', 'Web', 'Admin Dashboard', 'RBAC'],
    },
    {
      title: 'AI Caption Generator',
      category: 'Mobile / AI',
      description:
        'Released Flutter app that turns any photo into three ready-to-post social-media captions plus a curated hashtag set.',
      technologies: ['Flutter', 'Dart', 'Google Gemini Vision'],
    },
    {
      title: 'Rust Tooling',
      category: 'Systems',
      description:
        'Cross-platform screenshot capture, structured logging, image and media processing (OpenCV integration, blurhash encoding) and encryption/decryption implementations.',
      technologies: ['Rust', 'OpenCV', 'blurhash', 'cryptography'],
      githubUrl: 'https://github.com/RemonAhammad/screenshots-rs',
    },
    {
      title: 'WebRTC & P2P in Rust',
      category: 'Real-Time',
      description:
        'Rust WebRTC signalling and libp2p experiments — peer discovery, topic subscription and a distributed data store.',
      technologies: ['Rust', 'WebRTC', 'libp2p', 'WebSocket'],
      githubUrl: 'https://github.com/RemonAhammad/webrtc_rust',
    },
  ] as ResumeProject[],
};
