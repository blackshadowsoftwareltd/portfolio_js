// Sample projects data - you can replace with your real projects
export const projectsData = [
  {
    id: 1,
    title: "Flutter E-commerce App",
    description: "A complete e-commerce mobile application with payment integration and real-time updates.",
    technologies: ["Flutter", "Dart", "Firebase", "Stripe"],
    category: "Mobile",
    status: "Completed",
    githubUrl: "https://github.com/blackshadowsoftwareltd/flutter-ecommerce",
    demoUrl: "",
    stars: 24,
    forks: 8,
    image: "/projects/flutter-app.jpg"
  },
  {
    id: 2,
    title: "Rust Web Server",
    description: "High-performance web server built with Rust focusing on speed and memory safety.",
    technologies: ["Rust", "Actix-web", "PostgreSQL", "Docker"],
    category: "Backend",
    status: "Completed",
    githubUrl: "https://github.com/blackshadowsoftwareltd/rust-server",
    demoUrl: "",
    stars: 18,
    forks: 5,
    image: "/projects/rust-server.jpg"
  },
  {
    id: 3,
    title: "Go Microservices",
    description: "Scalable microservices architecture with service discovery and load balancing.",
    technologies: ["Go", "Docker", "Kubernetes", "gRPC"],
    category: "Backend",
    status: "Completed",
    githubUrl: "https://github.com/blackshadowsoftwareltd/go-microservices",
    demoUrl: "",
    stars: 32,
    forks: 12,
    image: "/projects/go-microservices.jpg"
  },
  {
    id: 4,
    title: "React Dashboard",
    description: "Modern admin dashboard with real-time analytics and responsive design.",
    technologies: ["React", "TypeScript", "Tailwind", "Chart.js"],
    category: "Web",
    status: "In Progress",
    githubUrl: "https://github.com/blackshadowsoftwareltd/react-dashboard",
    demoUrl: "https://dashboard-demo.com",
    stars: 15,
    forks: 6,
    image: "/projects/react-dashboard.jpg"
  },
  {
    id: 5,
    title: "AI Chat Bot",
    description: "Intelligent chatbot with natural language processing and learning capabilities.",
    technologies: ["Python", "TensorFlow", "FastAPI", "NLP"],
    category: "AI/ML",
    status: "Completed",
    githubUrl: "https://github.com/blackshadowsoftwareltd/ai-chatbot",
    demoUrl: "",
    stars: 41,
    forks: 15,
    image: "/projects/ai-chatbot.jpg"
  },
  {
    id: 6,
    title: "Mobile Game Engine",
    description: "Cross-platform game engine optimized for mobile devices with 2D/3D support.",
    technologies: ["C++", "OpenGL", "Android NDK", "iOS"],
    category: "Game Dev",
    status: "In Progress",
    githubUrl: "https://github.com/blackshadowsoftwareltd/mobile-engine",
    demoUrl: "",
    stars: 28,
    forks: 9,
    image: "/projects/game-engine.jpg"
  }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getCategoryColor = (category: string) => {
  const colors = {
    'Mobile': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Web': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Backend': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'AI/ML': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Game Dev': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};