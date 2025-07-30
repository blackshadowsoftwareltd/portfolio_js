export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  website?: string;
}

export const toolsData: Tool[] = [
  // Core Languages
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Google\'s UI toolkit for cross-platform mobile development',
    icon: '🦋',
    category: 'Mobile Framework',
    color: '#02569B',
    website: 'https://flutter.dev'
  },
  {
    id: 'dart',
    name: 'Dart',
    description: 'Programming language optimized for Flutter development',
    icon: '🎯',
    category: 'Language',
    color: '#0175C2',
    website: 'https://dart.dev'
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Systems programming language focused on safety and performance',
    icon: '🦀',
    category: 'Language',
    color: '#CE422B',
    website: 'https://rust-lang.org'
  },
  {
    id: 'go',
    name: 'Go',
    description: 'Fast, simple, and reliable language for building efficient software',
    icon: '🐹',
    category: 'Language',
    color: '#00ADD8',
    website: 'https://golang.org'
  },
  {
    id: 'c',
    name: 'C',
    description: 'Low-level programming language - basic knowledge',
    icon: '🔧',
    category: 'Language',
    color: '#A8B9CC',
    website: 'https://en.wikipedia.org/wiki/C_(programming_language)'
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Object-oriented programming language - basic knowledge',
    icon: '⚙️',
    category: 'Language',
    color: '#00599C',
    website: 'https://cplusplus.com'
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Object-oriented programming language - basic knowledge',
    icon: '☕',
    category: 'Language',
    color: '#ED8B00',
    website: 'https://java.com'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'High-level programming language - basic knowledge',
    icon: '🐍',
    category: 'Language',
    color: '#3776AB',
    website: 'https://python.org'
  },
  
  // Development Tools
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: 'Primary code editor with Flutter, Rust, and Go extensions',
    icon: '💻',
    category: 'Editor',
    color: '#007ACC',
    website: 'https://code.visualstudio.com'
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    description: 'Official IDE for Android development with Flutter support',
    icon: '📱',
    category: 'IDE',
    color: '#3DDC84',
    website: 'https://developer.android.com/studio'
  },
  {
    id: 'xcode',
    name: 'Xcode',
    description: 'Apple\'s IDE for iOS development with Flutter integration',
    icon: '🍎',
    category: 'IDE',
    color: '#147EFB',
    website: 'https://developer.apple.com/xcode'
  },
  
  // Flutter Development
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Google\'s platform for mobile and web app development',
    icon: '🔥',
    category: 'Backend Service',
    color: '#FFCA28',
    website: 'https://firebase.google.com'
  },
  {
    id: 'riverpod',
    name: 'Riverpod',
    description: 'State management library for Flutter applications',
    icon: '🌊',
    category: 'State Management',
    color: '#1976D2',
    website: 'https://riverpod.dev'
  },
  {
    id: 'provider',
    name: 'Provider',
    description: 'Simple state management for Flutter applications',
    icon: '📦',
    category: 'State Management',
    color: '#42A5F5',
    website: 'https://pub.dev/packages/provider'
  },
  {
    id: 'hive',
    name: 'Hive',
    description: 'Lightweight NoSQL database for Flutter apps',
    icon: '🗄️',
    category: 'Database',
    color: '#FFA000',
    website: 'https://hivedb.dev'
  },
  {
    id: 'isar',
    name: 'Isar',
    description: 'Super fast cross-platform database for Flutter',
    icon: '💎',
    category: 'Database',
    color: '#6B46C1',
    website: 'https://isar.dev'
  },
  {
    id: 'freezed',
    name: 'Freezed',
    description: 'Code generation for immutable classes in Flutter',
    icon: '❄️',
    category: 'Serialization',
    color: '#2563EB',
    website: 'https://pub.dev/packages/freezed'
  },
  
  // Rust Development
  {
    id: 'cargo',
    name: 'Cargo',
    description: 'Rust\'s package manager and build system',
    icon: '📦',
    category: 'Build Tool',
    color: '#CE422B',
    website: 'https://doc.rust-lang.org/cargo'
  },
  {
    id: 'tokio',
    name: 'Tokio',
    description: 'Asynchronous runtime for Rust applications',
    icon: '⚡',
    category: 'Runtime',
    color: '#000000',
    website: 'https://tokio.rs'
  },
  {
    id: 'serde',
    name: 'Serde',
    description: 'Serialization framework for Rust',
    icon: '🔄',
    category: 'Serialization',
    color: '#CE422B',
    website: 'https://serde.rs'
  },
  {
    id: 'axum',
    name: 'Axum',
    description: 'Ergonomic and modular web framework for Rust',
    icon: '🌐',
    category: 'Web Framework',
    color: '#CE422B',
    website: 'https://github.com/tokio-rs/axum'
  },
  {
    id: 'websocket',
    name: 'WebSocket',
    description: 'Real-time bidirectional communication protocol',
    icon: '🔌',
    category: 'Communication',
    color: '#4CAF50',
    website: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'
  },
  {
    id: 'grpc',
    name: 'gRPC',
    description: 'High-performance RPC framework by Google',
    icon: '⚡',
    category: 'Communication',
    color: '#244C5A',
    website: 'https://grpc.io'
  },
  {
    id: 'webrtc',
    name: 'WebRTC',
    description: 'Real-time peer-to-peer communication',
    icon: '📹',
    category: 'Communication',
    color: '#FF6B35',
    website: 'https://webrtc.org'
  },
  {
    id: 'rest-api',
    name: 'REST API',
    description: 'Representational State Transfer architectural style',
    icon: '🌐',
    category: 'API',
    color: '#2196F3',
    website: 'https://restfulapi.net'
  },
  {
    id: 'nginx',
    name: 'Nginx',
    description: 'High-performance web server and reverse proxy',
    icon: '🌐',
    category: 'Web Server',
    color: '#009639',
    website: 'https://nginx.org'
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Lightweight data-interchange format',
    icon: '📄',
    category: 'Data Format',
    color: '#000000',
    website: 'https://json.org'
  },
  {
    id: 'protobuf',
    name: 'Protocol Buffers',
    description: 'Language-neutral data serialization mechanism',
    icon: '📦',
    category: 'Serialization',
    color: '#4285F4',
    website: 'https://developers.google.com/protocol-buffers'
  },
  {
    id: 'jwt',
    name: 'JWT',
    description: 'JSON Web Tokens for secure information transmission',
    icon: '🔐',
    category: 'Authentication',
    color: '#000000',
    website: 'https://jwt.io'
  },
  {
    id: 'oauth',
    name: 'OAuth',
    description: 'Open standard for access delegation',
    icon: '🔑',
    category: 'Authentication',
    color: '#4285F4',
    website: 'https://oauth.net'
  },
  {
    id: 'sled',
    name: 'Sled',
    description: 'Modern embedded database for Rust applications',
    icon: '🛷',
    category: 'Database',
    color: '#CE422B',
    website: 'https://sled.rs'
  },
  {
    id: 'libp2p',
    name: 'libp2p',
    description: 'Modular peer-to-peer networking stack',
    icon: '🌐',
    category: 'P2P Network',
    color: '#CE422B',
    website: 'https://libp2p.io'
  },
  
  // Go Development
  {
    id: 'gin',
    name: 'Gin',
    description: 'HTTP web framework for Go applications',
    icon: '🍸',
    category: 'Web Framework',
    color: '#00ADD8',
    website: 'https://gin-gonic.com'
  },
  {
    id: 'gorm',
    name: 'GORM',
    description: 'ORM library for Go with database support',
    icon: '🗃️',
    category: 'ORM',
    color: '#00ADD8',
    website: 'https://gorm.io'
  },
  {
    id: 'gorilla',
    name: 'Gorilla',
    description: 'Web toolkit for Go language',
    icon: '🦍',
    category: 'Web Toolkit',
    color: '#00ADD8',
    website: 'https://gorilla.github.io'
  },
  
  // Database & Storage
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Advanced relational database for backend applications',
    icon: '🐘',
    category: 'Database',
    color: '#336791',
    website: 'https://postgresql.org'
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory data structure store for caching',
    icon: '🔴',
    category: 'Cache',
    color: '#DC382D',
    website: 'https://redis.io'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Embedded SQL database for mobile and desktop apps',
    icon: '💾',
    category: 'Database',
    color: '#003B57',
    website: 'https://sqlite.org'
  },
  
  // DevOps & Tools
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containerization for consistent development environments',
    icon: '🐳',
    category: 'DevOps',
    color: '#2496ED',
    website: 'https://docker.com'
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Version control system for code management',
    icon: '🌿',
    category: 'Version Control',
    color: '#F05032',
    website: 'https://git-scm.com'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code hosting and collaboration platform',
    icon: '🐙',
    category: 'Version Control',
    color: '#181717',
    website: 'https://github.com'
  },
  
  // Testing & Debugging
  {
    id: 'postman',
    name: 'Postman',
    description: 'API development and testing platform',
    icon: '📮',
    category: 'API Testing',
    color: '#FF6C37',
    website: 'https://postman.com'
  },
  {
    id: 'curlx',
    name: 'cURL',
    description: 'Command-line tool for transferring data with URLs',
    icon: '🌐',
    category: 'API Testing',
    color: '#073551',
    website: 'https://curl.se'
  },
  {
    id: 'flutter-inspector',
    name: 'Flutter Inspector',
    description: 'Widget debugging tool for Flutter apps',
    icon: '🔍',
    category: 'Debugging',
    color: '#02569B'
  },
  
  // Terminal & CLI
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Command-line interface for development workflow',
    icon: '⌨️',
    category: 'Terminal',
    color: '#000000'
  },
  {
    id: 'flutter-cli',
    name: 'Flutter CLI',
    description: 'Command-line tools for Flutter development',
    icon: '🔧',
    category: 'CLI Tool',
    color: '#02569B'
  }
];

export const toolCategories = Array.from(new Set(toolsData.map(tool => tool.category)));