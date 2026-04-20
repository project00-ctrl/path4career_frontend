/**
 * Path4Career — Certificate Catalog (Dynamic Backend Integration)
 * 
 * Fetches modules and user certificates from the backend API.
 * Renders a catalog of course cards showing earned/locked status.
 * Opens a certificate modal with dynamic data for earned certificates.
 * Supports PDF download via window.print().
 * 
 * URL Parameters:
 *   ?moduleId=5   → auto-open that module's certificate on load
 */

// ──────────────────────────────────────────
// API CONFIG
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080' 
    : 'https://path4career-backend.onrender.com';

// ──────────────────────────────────────────
// COLOR PALETTE — deterministic per module
// ──────────────────────────────────────────
const DIFFICULTY_COLORS = {
    'BEGINNER': '#2A9D5C',
    'INTERMEDIATE': '#2563EB',
    'ADVANCED': '#7C3AED'
};

const FALLBACK_COLORS = [
    '#2A9D5C', '#2563EB', '#D97706', '#7C3AED', '#B45309',
    '#DC2626', '#0891B2', '#4F46E5', '#059669', '#9333EA'
];

function getModuleColor(module) {
    if (module.difficulty && DIFFICULTY_COLORS[module.difficulty.toUpperCase()]) {
        return DIFFICULTY_COLORS[module.difficulty.toUpperCase()];
    }
    return FALLBACK_COLORS[module.id % FALLBACK_COLORS.length];
}

// ──────────────────────────────────────────
// COURSE BUNDLES — predefined groupings
// ──────────────────────────────────────────
const COURSE_BUNDLES = [
    {
        "id": "frontend-dev",
        "name": "Frontend Development Professional",
        "icon": "\ud83d\udda5\ufe0f",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Master HTML, CSS, and JavaScript for modern web interfaces.",
        "requiredModuleNames": [
            "HTML",
            "CSS",
            "JavaScript"
        ]
    },
    {
        "id": "fullstack-master",
        "name": "Full Stack Mastery",
        "icon": "\ud83d\ude80",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "End-to-end development mastery from frontend to backend.",
        "requiredModuleNames": [
            "HTML",
            "CSS",
            "JavaScript",
            "Node.js",
            "SQL"
        ]
    },
    {
        "id": "html",
        "name": "HTML Mastery Certificate",
        "icon": "\ud83c\udf10",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for HTML. The language for building web pages.",
        "requiredModuleNames": [
            "HTML"
        ]
    },
    {
        "id": "css",
        "name": "CSS Mastery Certificate",
        "icon": "\ud83c\udfa8",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for CSS. The language for styling web pages.",
        "requiredModuleNames": [
            "CSS"
        ]
    },
    {
        "id": "javascript",
        "name": "JavaScript Mastery Certificate",
        "icon": "\u26a1",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for JavaScript. The programming language of the web.",
        "requiredModuleNames": [
            "JavaScript"
        ]
    },
    {
        "id": "bootstrap",
        "name": "Bootstrap Mastery Certificate",
        "icon": "\ud83c\udd71\ufe0f",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Bootstrap. Popular CSS framework for responsive design.",
        "requiredModuleNames": [
            "Bootstrap"
        ]
    },
    {
        "id": "tailwind-css",
        "name": "Tailwind CSS Mastery Certificate",
        "icon": "\ud83c\udf0a",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Tailwind CSS. Utility-first CSS framework for rapid UI development.",
        "requiredModuleNames": [
            "Tailwind CSS"
        ]
    },
    {
        "id": "react",
        "name": "React Mastery Certificate",
        "icon": "\u269b\ufe0f",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for React. JavaScript library for building user interfaces.",
        "requiredModuleNames": [
            "React"
        ]
    },
    {
        "id": "angular",
        "name": "Angular Mastery Certificate",
        "icon": "\ud83c\udd70\ufe0f",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Angular. TypeScript-based platform for web applications.",
        "requiredModuleNames": [
            "Angular"
        ]
    },
    {
        "id": "vuejs",
        "name": "Vue.js Mastery Certificate",
        "icon": "\ud83d\udc9a",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Vue.js. Progressive JavaScript framework for UIs.",
        "requiredModuleNames": [
            "Vue.js"
        ]
    },
    {
        "id": "nextjs",
        "name": "Next.js Mastery Certificate",
        "icon": "\u25b2",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Next.js. React framework for production-ready web apps.",
        "requiredModuleNames": [
            "Next.js"
        ]
    },
    {
        "id": "jquery",
        "name": "jQuery Mastery Certificate",
        "icon": "\ud83d\udce6",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for jQuery. Fast and feature-rich JavaScript library.",
        "requiredModuleNames": [
            "jQuery"
        ]
    },
    {
        "id": "typescript",
        "name": "TypeScript Mastery Certificate",
        "icon": "\ud83d\udcdc",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for TypeScript. Typed superset of JavaScript for large apps.",
        "requiredModuleNames": [
            "TypeScript"
        ]
    },
    {
        "id": "xml",
        "name": "XML Mastery Certificate",
        "icon": "\ud83d\udcc4",
        "color": "#2563EB",
        "gradient": "linear-gradient(135deg, #1e3a5f, #2563EB)",
        "description": "Official certification program for XML. Markup language for structured data.",
        "requiredModuleNames": [
            "XML"
        ]
    },
    {
        "id": "python",
        "name": "Python Mastery Certificate",
        "icon": "\ud83d\udc0d",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for Python. Versatile language for backend and data science.",
        "requiredModuleNames": [
            "Python"
        ]
    },
    {
        "id": "java",
        "name": "Java Mastery Certificate",
        "icon": "\u2615",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for Java. Enterprise-grade object-oriented language.",
        "requiredModuleNames": [
            "Java"
        ]
    },
    {
        "id": "php",
        "name": "PHP Mastery Certificate",
        "icon": "\ud83d\udc18",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for PHP. Server-side scripting language for the web.",
        "requiredModuleNames": [
            "PHP"
        ]
    },
    {
        "id": "c",
        "name": "C Mastery Certificate",
        "icon": "\ud83d\udcbb",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for C. Low-level language for system programming.",
        "requiredModuleNames": [
            "C"
        ]
    },
    {
        "id": "c++",
        "name": "C++ Mastery Certificate",
        "icon": "\u2699\ufe0f",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for C++. Powerful language for high-performance apps.",
        "requiredModuleNames": [
            "C++"
        ]
    },
    {
        "id": "c#",
        "name": "C# Mastery Certificate",
        "icon": "\ud83d\udd37",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for C#. Modern language for Windows and game dev.",
        "requiredModuleNames": [
            "C#"
        ]
    },
    {
        "id": "go",
        "name": "Go Mastery Certificate",
        "icon": "\ud83d\udc39",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for Go. Fast, reliable language built by Google.",
        "requiredModuleNames": [
            "Go"
        ]
    },
    {
        "id": "r",
        "name": "R Mastery Certificate",
        "icon": "\ud83d\udcca",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #065f46, #059669)",
        "description": "Official certification program for R. Statistical computing and graphics language.",
        "requiredModuleNames": [
            "R"
        ]
    },
    {
        "id": "nodejs",
        "name": "Node.js Mastery Certificate",
        "icon": "\ud83d\udfe2",
        "color": "#d97706",
        "gradient": "linear-gradient(135deg, #92400e, #d97706)",
        "description": "Official certification program for Node.js. JavaScript runtime for server-side development.",
        "requiredModuleNames": [
            "Node.js"
        ]
    },
    {
        "id": "deno",
        "name": "Deno Mastery Certificate",
        "icon": "\ud83e\udd95",
        "color": "#d97706",
        "gradient": "linear-gradient(135deg, #92400e, #d97706)",
        "description": "Official certification program for Deno. Modern runtime for JavaScript and TypeScript.",
        "requiredModuleNames": [
            "Deno"
        ]
    },
    {
        "id": "django",
        "name": "Django Mastery Certificate",
        "icon": "\ud83c\udfb8",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Django. High-level Python web framework.",
        "requiredModuleNames": [
            "Django"
        ]
    },
    {
        "id": "flask",
        "name": "Flask Mastery Certificate",
        "icon": "\ud83e\uddea",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Flask. Lightweight Python web microframework.",
        "requiredModuleNames": [
            "Flask"
        ]
    },
    {
        "id": "fastapi",
        "name": "FastAPI Mastery Certificate",
        "icon": "\ud83d\ude80",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for FastAPI. Modern high-performance Python API framework.",
        "requiredModuleNames": [
            "FastAPI"
        ]
    },
    {
        "id": "nestjs",
        "name": "NestJS Mastery Certificate",
        "icon": "\ud83d\udc08",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for NestJS. Progressive Node.js framework for server apps.",
        "requiredModuleNames": [
            "NestJS"
        ]
    },
    {
        "id": "spring-boot",
        "name": "Spring Boot Mastery Certificate",
        "icon": "\ud83c\udf43",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for Spring Boot. Java framework for production-ready apps.",
        "requiredModuleNames": [
            "Spring Boot"
        ]
    },
    {
        "id": "aspnet",
        "name": "ASP.NET Mastery Certificate",
        "icon": "\ud83d\udfe6",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for ASP.NET. Microsoft web framework for building APIs.",
        "requiredModuleNames": [
            "ASP.NET"
        ]
    },
    {
        "id": "graphql",
        "name": "GraphQL Mastery Certificate",
        "icon": "\u25c8",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for GraphQL. Query language for flexible APIs.",
        "requiredModuleNames": [
            "GraphQL"
        ]
    },
    {
        "id": "rest-api",
        "name": "REST API Mastery Certificate",
        "icon": "\ud83d\udd17",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "description": "Official certification program for REST API. Architectural style for web services.",
        "requiredModuleNames": [
            "REST API"
        ]
    },
    {
        "id": "sql",
        "name": "SQL Mastery Certificate",
        "icon": "\ud83d\uddc3\ufe0f",
        "color": "#db2777",
        "gradient": "linear-gradient(135deg, #831843, #db2777)",
        "description": "Official certification program for SQL. Standard language for managing databases.",
        "requiredModuleNames": [
            "SQL"
        ]
    },
    {
        "id": "mysql",
        "name": "MySQL Mastery Certificate",
        "icon": "\ud83d\udc2c",
        "color": "#db2777",
        "gradient": "linear-gradient(135deg, #831843, #db2777)",
        "description": "Official certification program for MySQL. Popular open-source relational database.",
        "requiredModuleNames": [
            "MySQL"
        ]
    },
    {
        "id": "postgresql",
        "name": "PostgreSQL Mastery Certificate",
        "icon": "\ud83d\udc18",
        "color": "#db2777",
        "gradient": "linear-gradient(135deg, #831843, #db2777)",
        "description": "Official certification program for PostgreSQL. Advanced open-source relational database.",
        "requiredModuleNames": [
            "PostgreSQL"
        ]
    },
    {
        "id": "mongodb",
        "name": "MongoDB Mastery Certificate",
        "icon": "\ud83c\udf43",
        "color": "#db2777",
        "gradient": "linear-gradient(135deg, #831843, #db2777)",
        "description": "Official certification program for MongoDB. NoSQL database for modern applications.",
        "requiredModuleNames": [
            "MongoDB"
        ]
    },
    {
        "id": "clickhouse",
        "name": "ClickHouse Mastery Certificate",
        "icon": "\ud83c\udfe0",
        "color": "#db2777",
        "gradient": "linear-gradient(135deg, #831843, #db2777)",
        "description": "Official certification program for ClickHouse. OLAP database for real-time analytics.",
        "requiredModuleNames": [
            "ClickHouse"
        ]
    },
    {
        "id": "numpy",
        "name": "NumPy Mastery Certificate",
        "icon": "\ud83d\udd22",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for NumPy. Python library for numerical computing.",
        "requiredModuleNames": [
            "NumPy"
        ]
    },
    {
        "id": "pandas",
        "name": "Pandas Mastery Certificate",
        "icon": "\ud83d\udc3c",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Pandas. Data manipulation and analysis library.",
        "requiredModuleNames": [
            "Pandas"
        ]
    },
    {
        "id": "matplotlib",
        "name": "Matplotlib Mastery Certificate",
        "icon": "\ud83d\udcc8",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Matplotlib. Python library for data visualization.",
        "requiredModuleNames": [
            "Matplotlib"
        ]
    },
    {
        "id": "seaborn",
        "name": "Seaborn Mastery Certificate",
        "icon": "\ud83c\udfa8",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Seaborn. Statistical data visualization in Python.",
        "requiredModuleNames": [
            "Seaborn"
        ]
    },
    {
        "id": "data-science",
        "name": "Data Science Mastery Certificate",
        "icon": "\ud83d\udd2c",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Data Science. Foundations of data science and analytics.",
        "requiredModuleNames": [
            "Data Science"
        ]
    },
    {
        "id": "pytorch",
        "name": "PyTorch Mastery Certificate",
        "icon": "\ud83d\udd25",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for PyTorch. Deep learning framework by Meta.",
        "requiredModuleNames": [
            "PyTorch"
        ]
    },
    {
        "id": "apache-spark",
        "name": "Apache Spark Mastery Certificate",
        "icon": "\u26a1",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Apache Spark. Big data processing engine.",
        "requiredModuleNames": [
            "Apache Spark"
        ]
    },
    {
        "id": "power-bi",
        "name": "Power BI Mastery Certificate",
        "icon": "\ud83d\udcca",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for Power BI. Business intelligence and reporting tool.",
        "requiredModuleNames": [
            "Power BI"
        ]
    },
    {
        "id": "ai",
        "name": "AI Mastery Certificate",
        "icon": "\ud83e\udd16",
        "color": "#0891B2",
        "gradient": "linear-gradient(135deg, #164e63, #0891B2)",
        "description": "Official certification program for AI. Artificial intelligence fundamentals.",
        "requiredModuleNames": [
            "AI"
        ]
    },
    {
        "id": "dsa",
        "name": "DSA Mastery Certificate",
        "icon": "\ud83e\uddee",
        "color": "#4F46E5",
        "gradient": "linear-gradient(135deg, #312e81, #4F46E5)",
        "description": "Official certification program for DSA. Data Structures and Algorithms essentials.",
        "requiredModuleNames": [
            "DSA"
        ]
    },
    {
        "id": "excel",
        "name": "Excel Mastery Certificate",
        "icon": "\ud83d\udcca",
        "color": "#4b5563",
        "gradient": "linear-gradient(135deg, #1f2937, #4b5563)",
        "description": "Official certification program for Excel. Spreadsheet tool for data analysis.",
        "requiredModuleNames": [
            "Excel"
        ]
    },
    {
        "id": "git",
        "name": "Git Mastery Certificate",
        "icon": "\ud83d\udd00",
        "color": "#4b5563",
        "gradient": "linear-gradient(135deg, #1f2937, #4b5563)",
        "description": "Official certification program for Git. Version control system for source code.",
        "requiredModuleNames": [
            "Git"
        ]
    },
    {
        "id": "docker",
        "name": "Docker Mastery Certificate",
        "icon": "\ud83d\udc33",
        "color": "#ea580c",
        "gradient": "linear-gradient(135deg, #7c2d12, #ea580c)",
        "description": "Official certification program for Docker. Platform for containerized applications.",
        "requiredModuleNames": [
            "Docker"
        ]
    },
    {
        "id": "kubernetes",
        "name": "Kubernetes Mastery Certificate",
        "icon": "\u2638\ufe0f",
        "color": "#ea580c",
        "gradient": "linear-gradient(135deg, #7c2d12, #ea580c)",
        "description": "Official certification program for Kubernetes. Container orchestration at scale.",
        "requiredModuleNames": [
            "Kubernetes"
        ]
    },
    {
        "id": "aws",
        "name": "AWS Mastery Certificate",
        "icon": "\u2601\ufe0f",
        "color": "#ea580c",
        "gradient": "linear-gradient(135deg, #7c2d12, #ea580c)",
        "description": "Official certification program for AWS. Amazon Web Services cloud platform.",
        "requiredModuleNames": [
            "AWS"
        ]
    }
];

function getCardIconForCert(name) {
    const t = (name || '').toLowerCase();
    if (/web|html|css/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';
    if (/front|react|bootstrap|jquery|ui|angular|vue/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>';
    if (/python|data|machine|ml|ai|pandas|numpy/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    if (/java|enterprise|c#|spring|\.net/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';
    if (/back|server|api|node|express|django/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';
    if (/full\s*stack/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    if (/database|sql|mongo|postgre/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>';
    if (/secur|cyber|hack/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    if (/cloud|devops|docker|aws|azure/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>';
    if (/mobile|android|ios|flutter|swift/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
    if (/system|low.level|c\b|c\+\+|memory/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
}

// ──────────────────────────────────────────
// STATE
// ──────────────────────────────────────────
let allModules = [];
let earnedCertificates = {};  // moduleId → CertificateResponseDTO
let activeFilter = 'all';

// ──────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────
const catalogGrid = document.getElementById('catalogGrid');
const modal = document.getElementById('certModal');
const modalOverlay = document.getElementById('modalOverlay');
const certContainer = document.getElementById('certContainer');
const btnClose = document.getElementById('btnClose');
const btnPrint = document.getElementById('btnPrint');
const btnDownload = document.getElementById('btnDownload');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const countEl = document.getElementById('courseCount');
const loadingEl = document.getElementById('certLoading');
const errorEl = document.getElementById('certError');

// ──────────────────────────────────────────
// AUTH HELPERS
// ──────────────────────────────────────────
function getToken() {
    return localStorage.getItem('AUTH_TOKEN');
}

function getUserData() {
    try {
        const data = localStorage.getItem('path4careerUser');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

// ──────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogData();
    setupTabs();
});

// ──────────────────────────────────────────
// TAB SWITCHING
// ──────────────────────────────────────────
function setupTabs() {
    const tabIndividual = document.getElementById('tabIndividual');
    const tabBundles = document.getElementById('tabBundles');
    const individualView = document.getElementById('individualView');
    const bundlesView = document.getElementById('bundlesView');
    const controlsBar = document.querySelector('.controls-bar');

    if (!tabIndividual || !tabBundles) return;

    tabIndividual.addEventListener('click', () => {
        tabIndividual.classList.add('active');
        tabBundles.classList.remove('active');
        individualView.style.display = '';
        bundlesView.style.display = 'none';
        if (controlsBar) controlsBar.style.display = '';
    });

    tabBundles.addEventListener('click', () => {
        tabBundles.classList.add('active');
        tabIndividual.classList.remove('active');
        individualView.style.display = 'none';
        bundlesView.style.display = '';
        if (controlsBar) controlsBar.style.display = 'none';
        renderBundles();
    });
}

async function loadCatalogData() {
    showLoading(true);
    showError(false);

    try {
        // 1. Fetch all modules (public endpoint)
        const modulesRes = await fetch(`${API_BASE_URL}/api/user/modules`);
        if (!modulesRes.ok) throw new Error('Failed to load modules');
        allModules = await modulesRes.json();

        // 2. Refresh & fetch user's certificates (requires auth)
        //    POST /refresh scans quiz completions and issues missing certs
        const token = getToken();
        if (token) {
            try {
                const certRes = await fetch(`${API_BASE_URL}/api/v1/certificates/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
                if (certRes.ok) {
                    const certs = await certRes.json();
                    earnedCertificates = {};
                    certs.forEach(cert => {
                        earnedCertificates[cert.moduleId] = cert;
                    });
                    console.log('Certificates loaded:', Object.keys(earnedCertificates).length);
                } else {
                    console.warn('Certificate refresh failed:', certRes.status, await certRes.text());
                }
            } catch (err) {
                console.warn('Could not fetch certificates:', err);
            }
        }

        showLoading(false);
        applyFilters();

        // Auto-open certificate if ?moduleId= is in URL
        const params = new URLSearchParams(window.location.search);
        const autoOpenId = params.get('moduleId');
        if (autoOpenId && earnedCertificates[Number(autoOpenId)]) {
            openCertificate(Number(autoOpenId));
        }
    } catch (err) {
        console.error('Failed to load catalog:', err);
        showLoading(false);
        showError(true);
    }
}

function showLoading(show) {
    loadingEl.style.display = show ? 'flex' : 'none';
    catalogGrid.style.display = show ? 'none' : '';
}

function showError(show) {
    errorEl.style.display = show ? 'flex' : 'none';
    catalogGrid.style.display = show ? 'none' : '';
}

// ──────────────────────────────────────────
// CATALOG RENDERING
// ──────────────────────────────────────────
function renderCatalog(list) {
    catalogGrid.innerHTML = '';
    countEl.textContent = list.length;

    if (!list.length) {
        catalogGrid.innerHTML = '<p class="empty-state">No courses found.</p>';
        return;
    }

    list.forEach((module, i) => {
        const cert = earnedCertificates[module.id];
        const isEarned = !!cert;
        const color = getModuleColor(module);
        const badgeIcon = getCardIconForCert(module.name);
        const difficulty = module.difficulty || 'Beginner';
        const duration = module.durationValue
            ? `${module.durationValue} ${(module.durationUnit || 'WEEKS').toLowerCase()}`
            : '—';
        const skillCount = module.skillIds ? module.skillIds.length : 0;

        const card = document.createElement('div');
        card.className = `course-card ${isEarned ? 'earned' : 'locked'}`;
        card.style.animationDelay = (i * 0.07) + 's';
        card.style.setProperty('--c-color', color);
        card.style.setProperty('--btn-color', color);

        let statusHtml;
        if (isEarned) {
            statusHtml = `
                <div class="card-status earned">
                    <span class="status-dot earned"></span>
                    <span>Certificate Earned</span>
                </div>`;
        } else {
            statusHtml = `
                <a href="quiz.html?moduleId=${module.id}" class="card-status locked" style="text-decoration:none; cursor:pointer;">
                    <span class="status-dot locked"></span>
                    <span>Complete Quiz to Earn →</span>
                </a>`;
        }

        let actionHtml;
        if (isEarned) {
            actionHtml = `
                <div class="card-actions-dual">
                    <button class="btn-view-cert" onclick="openCertificate(${module.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        View Certificate
                    </button>
                    <button class="btn-view-demo" onclick="openDemoCertificate(${module.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Demo
                    </button>
                </div>`;
        } else {
            actionHtml = `
                <div class="card-actions-dual">
                    <a href="quiz.html?moduleId=${module.id}" class="btn-take-quiz">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Take Quiz →
                    </a>
                    <button class="btn-view-demo" onclick="openDemoCertificate(${module.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Demo
                    </button>
                </div>`;
        }

        card.innerHTML =
            '<div class="card-top">' +
                '<div class="card-badge" style="background:' + color + '18;color:' + color + ';border-color:' + color + '40">' + badgeIcon + '</div>' +
                '<span class="card-level">' + difficulty + '</span>' +
            '</div>' +
            '<h3 class="card-title">' + escapeHtml(module.name) + '</h3>' +
            '<p class="card-subtitle">' + (module.description ? escapeHtml(module.description).substring(0, 80) + (module.description.length > 80 ? '…' : '') : '—') + '</p>' +
            '<div class="card-meta">' +
                '<span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + duration + '</span>' +
                '<span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' + skillCount + ' Skills</span>' +
            '</div>' +
            statusHtml +
            actionHtml;

        catalogGrid.appendChild(card);

    });
}

// ──────────────────────────────────────────
// SEARCH & FILTER
// ──────────────────────────────────────────
function applyFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const filtered = allModules.filter(m => {
        const matchSearch = !q || (m.name && m.name.toLowerCase().includes(q)) ||
                              (m.description && m.description.toLowerCase().includes(q));
        const diff = (m.difficulty || '').toLowerCase();
        const matchFilter = activeFilter === 'all'
            || (activeFilter === 'beginner' && diff.includes('beginner'))
            || (activeFilter === 'intermediate' && diff.includes('intermediate'))
            || (activeFilter === 'advanced' && diff.includes('advanced'));
        return matchSearch && matchFilter;
    });
    renderCatalog(filtered);
}

searchInput.addEventListener('input', applyFilters);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyFilters();
    });
});

// ──────────────────────────────────────────
// QR CODE
// ──────────────────────────────────────────
function buildQR(certId) {
    const url = 'https://path4career.io/verify/' + certId;
    const src = 'https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=' +
        encodeURIComponent(url) + '&color=000000&bgcolor=ffffff&format=png&qzone=1';
    return '<img src="' + src + '" class="cert-qr-img" width="64" height="64" alt="Verify QR">';
}

// ──────────────────────────────────────────
// GOLD CERTIFIED BADGE SVG
// ──────────────────────────────────────────
function buildBadge(color) {
    const pts = [];
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const r = i % 2 === 0 ? 46 : 40;
        pts.push((50 + r * Math.cos(angle)).toFixed(2) + ',' + (50 + r * Math.sin(angle)).toFixed(2));
    }
    return (
        '<svg class="cert-badge-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="' + pts.join(' ') + '" fill="url(#goldGrad)" stroke="#8B6914" stroke-width="0.8"/>' +
        '<circle cx="50" cy="50" r="32" fill="' + color + '"/>' +
        '<circle cx="50" cy="50" r="32" fill="none" stroke="#C9A84C" stroke-width="1.5"/>' +
        '<path d="M24 68 L18 80 L30 74 L36 80 Z" fill="#C9A84C"/>' +
        '<path d="M76 68 L82 80 L70 74 L64 80 Z" fill="#C9A84C"/>' +
        '<polygon points="50,28 53,38 63,38 55,44 58,54 50,48 42,54 45,44 37,38 47,38" fill="#F0D080" stroke="#C9A84C" stroke-width="0.5"/>' +
        '<text x="50" y="63" text-anchor="middle" font-family="Lato,sans-serif" font-weight="900" font-size="8.5" fill="#FFFFFF" letter-spacing="1">CERTIFIED</text>' +
        '<defs><linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F0D080"/><stop offset="50%" stop-color="#C9A84C"/><stop offset="100%" stop-color="#8B6914"/></linearGradient></defs>' +
        '</svg>'
    );
}

// ──────────────────────────────────────────
// BUILD CERTIFICATE HTML
// ──────────────────────────────────────────
function buildCertHTML(cert, isDemo = false) {
    const module = allModules.find(m => m.id === cert.moduleId) || {};
    const color = getModuleColor(module);
    const courseName = cert.moduleName || module.name || 'Course';
    const recipientName = isDemo ? 'Demo Candidate' : (cert.issuedToName || 'Student');
    const certId = cert.certificateId || 'CP-0000-00000';
    const verifyUrl = 'verify.path4career.com/' + certId;
    const difficulty = cert.difficulty || module.difficulty || 'Intermediate';
    const duration = cert.durationValue
        ? `${cert.durationValue} ${(cert.durationUnit || 'WEEKS').charAt(0) + (cert.durationUnit || 'WEEKS').slice(1).toLowerCase()}`
        : '—';
    const skillCount = cert.skillCount || (module.skillIds ? module.skillIds.length : 0);

    const issuedDate = cert.issuedAt
        ? new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });


    return (
        '<div class="certificate" id="printArea" style="--cert-color:' + color + '">' +

        /* outer border */
        '<div class="cert-outer-border" style="border-color:' + color + '55"></div>' +

        /* wave bottom */
        '<div class="cert-wave">' +
            '<svg viewBox="0 0 900 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M0,80 C150,140 300,20 450,80 C600,140 750,20 900,80 L900,160 L0,160 Z" fill="' + color + '14"/>' +
                '<path d="M0,110 C150,160 300,60 450,110 C600,160 750,60 900,110 L900,160 L0,160 Z" fill="' + color + '0D"/>' +
            '</svg>' +
        '</div>' +

        /* watermark */
        '<div class="cert-watermark">' +
            '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M10 80 L30 30 L50 60 L70 20 L90 45" stroke="' + color + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<polygon points="75,20 90,20 90,35" fill="' + color + '"/>' +
            '</svg>' +
        '</div>' +

        /* ── CONTENT ── */
        '<div class="cert-content">' +

            /* Top row: logo | title | QR */
            '<div class="cert-top-row">' +

                '<div class="cert-logo">' +
                    '<div class="cert-logo-icon">' +
                        '<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">' +
                            '<circle cx="22" cy="22" r="22" fill="url(#lg2)"/>' +
                            '<defs><linearGradient id="lg2" x1="0" y1="0" x2="44" y2="44"><stop stop-color="#34C67A"/><stop offset="1" stop-color="#1A8C4E"/></linearGradient></defs>' +
                            '<path d="M10 28 L17 19 L24 23 L34 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
                            '<polyline points="28,13 34,13 34,19" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div>' +
                        '<span class="cert-logo-brand">Path4Career</span>' +
                        '<span class="cert-logo-tagline">path4career.io</span>' +
                    '</div>' +
                '</div>' +

                '<div class="cert-title-block">' +
                    '<div class="cert-main-title">CERTIFICATE <span>of</span> COMPLETION</div>' +
                    '<div class="cert-title-rule" style="background:linear-gradient(90deg,transparent,' + color + ',transparent)"></div>' +
                '</div>' +

                '<div class="cert-qr-block">' +
                    '<div class="cert-qr-wrap">' + buildQR(certId) + '</div>' +
                    '<div class="cert-qr-id">Certificate ID: ' + certId + '</div>' +
                '</div>' +

            '</div>' +

            /* This certifies that */
            '<p class="cert-certifies">This certifies that</p>' +

            /* Recipient */
            '<div class="cert-recipient">' + escapeHtml(recipientName) + '</div>' +

            /* Completion text */
            '<p class="cert-completion-text">has successfully completed the <strong>Path4Career Program</strong> and is hereby declared a</p>' +

            /* Gold badge */
            '<div class="cert-badge-center">' + buildBadge(color) + '</div>' +

            /* Course name */
            '<div class="cert-course-name">' + escapeHtml(courseName) + '</div>' +

            /* Thin rule */
            '<div class="cert-bottom-rule"></div>' +

            /* Meta: duration · level · skills */
            '<div class="cert-meta-inline">' +
                '<span><strong>Duration:</strong>&nbsp;' + duration + '</span>' +
                '<span>·</span>' +
                '<span><strong>Level:</strong>&nbsp;' + difficulty + '</span>' +
                '<span>·</span>' +
                '<span><strong>Skills:</strong>&nbsp;' + skillCount + ' Completed</span>' +
            '</div>' +

            /* Bottom info row: issued (center) + signature (right) */
            '<div class="cert-info-row">' +

                '<div style="flex:1"></div>' +

                '<div class="cert-issued">Issued ' + issuedDate + '</div>' +

                '<div class="cert-sig-block">' +
                    '<div class="cert-sig-scribble">' +
                        '<img src="../assets/images/sakthivel-signature.jpeg" alt="Signature" style="height: 60px;">' +
                    '</div>' +
                    '<div class="cert-sig-line"></div>' +
                    '<div class="cert-sig-name">Sakthivel</div>' +
                    '<div class="cert-sig-role">Director of Path4Career</div>' +
                '</div>' +

            '</div>' +

        '</div>' +

        /* Verify URL bottom-left */
        '<div class="cert-verify">' +
            '<strong>Verify at</strong>' +
            '<span>' + verifyUrl + '</span>' +
        '</div>' +

        '</div>'
    );
}

// ──────────────────────────────────────────
// MODAL OPEN / CLOSE
// ──────────────────────────────────────────
function openCertificate(moduleId) {
    const cert = earnedCertificates[moduleId];
    if (!cert) return;

    modal.dataset.active = moduleId;
    certContainer.innerHTML = buildCertHTML(cert);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function openDemoCertificate(moduleId) {
    let module = allModules.find(m => m.id === moduleId);
    
    // Graceful fallback if backend data for this module is missing
    if (!module) {
        module = {
            id: moduleId,
            name: 'Course Demo',
            difficulty: 'INTERMEDIATE',
            durationValue: 4,
            durationUnit: 'WEEKS',
            skillIds: [1, 2, 3] 
        };
    }

    const mockCert = {
        moduleId: module.id,
        moduleName: module.name,
        issuedToName: 'Demo Candidate',
        certificateId: 'CP-DEMO-2024',
        issuedAt: new Date().toISOString(),
        difficulty: module.difficulty,
        durationValue: module.durationValue,
        durationUnit: module.durationUnit,
        skillCount: module.skillIds ? module.skillIds.length : 0
    };

    modal.dataset.active = moduleId;
    certContainer.innerHTML = buildCertHTML(mockCert, true);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function downloadCert() {
    const moduleId = Number(modal.dataset.active);
    const cert = earnedCertificates[moduleId];
    const courseName = cert ? cert.moduleName.replace(/\s+/g, '_') : 'Certificate';
    document.title = 'Path4Career_Certificate_' + courseName;
    window.print();
    document.title = 'Certificate Catalog — Path4Career';
}

// Null-safe event bindings (fallback — onclick handlers also exist on the buttons)
if (btnClose) btnClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
if (btnPrint) btnPrint.addEventListener('click', () => { window.print(); });
if (btnDownload) btnDownload.addEventListener('click', downloadCert);

// ──────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ──────────────────────────────────────────
// REFRESH CERTIFICATES — explicit sync from quiz completions
// ──────────────────────────────────────────
async function refreshCertificates() {
    const btn = document.getElementById('btnRefreshCerts');
    const token = getToken();

    if (!token) {
        alert('Please log in first to refresh your certificates.');
        return;
    }

    // Visual feedback
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Syncing...';
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/certificates/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Refresh failed:', res.status, errorText);
            alert('Certificate refresh failed: ' + res.status + '\n' + errorText);
            return;
        }

        const certs = await res.json();
        console.log('Refresh response — certificates:', certs);

        // Update local state
        earnedCertificates = {};
        certs.forEach(cert => {
            earnedCertificates[cert.moduleId] = cert;
        });

        // Re-render the catalog
        applyFilters();

        const count = Object.keys(earnedCertificates).length;
        if (btn) btn.textContent = `✅ ${count} Certificate${count !== 1 ? 's' : ''} Found`;

        // Auto-open if moduleId is in URL
        const params = new URLSearchParams(window.location.search);
        const autoOpenId = params.get('moduleId');
        if (autoOpenId && earnedCertificates[Number(autoOpenId)]) {
            openCertificate(Number(autoOpenId));
        }

    } catch (err) {
        console.error('Refresh error:', err);
        alert('Could not refresh certificates. Is the backend running?\n' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = '🔄 Refresh Certificates';
            }, 3000);
        }
    }
}

function retryLoad() {
    loadCatalogData();
}

// ──────────────────────────────────────────
// COURSE BUNDLES RENDERING
// ──────────────────────────────────────────
function renderBundles() {
    const grid = document.getElementById('bundlesGrid');
    if (!grid) return;

    grid.innerHTML = COURSE_BUNDLES.map(bundle => {
        // Find matching modules for this bundle
        const matchedModules = bundle.requiredModuleNames.map(name => {
            return allModules.find(m => m.name && m.name.toLowerCase() === name.toLowerCase());
        });

        const totalRequired = bundle.requiredModuleNames.length;
        let completedCount = 0;
        let firstIncompleteModule = null;
        let firstModule = matchedModules[0] || null;

        const moduleItemsHtml = bundle.requiredModuleNames.map((name, i) => {
            const mod = matchedModules[i];
            const isEarned = mod && earnedCertificates[mod.id];
            if (isEarned) {
                completedCount++;
            } else if (!firstIncompleteModule && mod) {
                firstIncompleteModule = mod;
            }
            const statusIcon = isEarned
                ? '<span class="bundle-mod-status earned">✓</span>'
                : '<span class="bundle-mod-status locked">○</span>';

            // Make each module item a clickable link to its quiz
            if (mod) {
                const modLink = isEarned
                    ? `<a href="javascript:void(0)" onclick="openCertificate(${mod.id})" class="bundle-mod-link earned-link" title="View Certificate">`
                    : `<a href="quiz.html?moduleId=${mod.id}" class="bundle-mod-link quiz-link" title="Take Quiz for ${escapeHtml(name)}">`;
                return `<div class="bundle-mod-item ${isEarned ? 'earned' : 'locked'}">
                    ${modLink}
                        ${statusIcon}
                        <span class="bundle-mod-name">${escapeHtml(name)}</span>
                        <span class="bundle-mod-arrow">${isEarned ? '🎓' : '→'}</span>
                    </a>
                </div>`;
            }

            return `<div class="bundle-mod-item locked">
                ${statusIcon}
                <span class="bundle-mod-name">${escapeHtml(name)}</span>
            </div>`;
        }).join('');

        const progress = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;
        const isComplete = completedCount === totalRequired;

        // Build action buttons — matching individual certificate card UX
        let statusHtml = '';
        let actionHtml = '';

        if (isComplete && firstModule) {
            // All modules completed
            statusHtml = `
                <div class="card-status earned" style="margin-top: 16px;">
                    <span class="status-dot earned"></span>
                    <span>Certificate Earned</span>
                </div>`;
            
            actionHtml = `
                <div class="card-actions-dual" style="flex-direction: column; gap: 8px;">
                    <button class="btn-view-cert" onclick="openCertificate(${firstModule.id})" style="width: 100%;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        View Certificate
                    </button>
                    ${firstModule ? `<button class="btn-view-demo" onclick="openDemoCertificate(${firstModule.id})" style="width: 100%;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Demo
                    </button>` : ''}
                </div>`;
        } else {
            // Incomplete bundle
            const quizTarget = firstIncompleteModule || firstModule || { id: bundle.requiredModuleNames[0] };
            const demoTarget = firstModule;

            statusHtml = `
                <a href="${quizTarget.id ? `quiz.html?moduleId=${quizTarget.id}` : 'quiz.html'}" class="card-status locked" style="text-decoration:none; cursor:pointer; margin-top: 16px;">
                    <span class="status-dot locked"></span>
                    <span>Complete Quiz to Earn →</span>
                </a>`;

            actionHtml = `
                <div class="card-actions-dual" style="flex-direction: column; gap: 8px;">
                    <a href="${quizTarget.id ? `quiz.html?moduleId=${quizTarget.id}` : 'quiz.html'}" class="btn-take-quiz" style="width: 100%;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Take Quiz →
                    </a>
                    <button class="btn-view-demo" onclick="${demoTarget && demoTarget.id ? `openDemoCertificate(${demoTarget.id})` : `alert('Demo not available for this bundle yet.')`}" style="width: 100%;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Demo
                    </button>
                </div>`;
        }

        return `
        <div class="bundle-card ${isComplete ? 'bundle-complete' : ''}">
            <div class="bundle-card-header" style="background: ${bundle.gradient}">
                <span class="bundle-card-icon">${bundle.icon}</span>
                <div class="bundle-card-title">
                    <h3>${escapeHtml(bundle.name)}</h3>
                    <span class="bundle-card-count">${completedCount}/${totalRequired} Completed</span>
                </div>
                ${isComplete ? '<span class="bundle-unlocked-badge">🏆 UNLOCKED</span>' : ''}
            </div>
            <div class="bundle-card-body">
                <p class="bundle-card-desc">${escapeHtml(bundle.description)}</p>
                <div class="bundle-progress">
                    <div class="bundle-progress-bar">
                        <div class="bundle-progress-fill" style="width: ${progress}%; background: ${bundle.gradient}"></div>
                    </div>
                    <span class="bundle-progress-text">${progress}%</span>
                </div>
                <div class="bundle-modules-list">
                    ${moduleItemsHtml}
                </div>
                ${statusHtml}
                ${actionHtml}
            </div>
        </div>`;
    }).join('');
}
