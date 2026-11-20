export const projects = [
  {
    id: "sentimate",
    number: "01",
    title: "Sentimate",
    featured: true,
    status: "in development (final-year project)",
    description: "Early-warning system for student mental health. A multilingual conversational survey screens for potential risk from structured responses. An XGBoost classifier with SHAP explanations lets reviewers see why each prediction was made. A counsellor dashboard is planned with consent-driven, human-reviewed follow-up instead of automated decisions.",
    stack: ["Python", "XGBoost", "SHAP", "FastAPI", "React", "Supabase"],
    problem: "[EDIT: what problem does this solve, in your words]",
    built: "[EDIT: what you personally built]",
    hardPart: "[EDIT: write the hardest problem you hit and how you solved it]",
    links: [{ label: "GitHub", href: "[EDIT]" }]
  },
  {
    id: "securecase",
    number: "02",
    title: "SecureCase",
    featured: true,
    status: "working prototype · Smart India Hackathon 2026",
    description: "Tamper-evident platform for FIRs, evidence records and court documents. Uploaded files get a real SHA-256 fingerprint through the Web Crypto API; a five-role permission matrix, audit trail, version history and a tamper-detection demo show how any change to a document is caught. The prototype is frontend-only; the FastAPI backend, PostgreSQL, encrypted storage and blockchain anchoring are planned.",
    stack: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Web Crypto API", "IndexedDB"],
    problem: "Case files and evidence move between police, forensic labs, prosecutors and courts by hand, and it is hard to prove that a document was not altered on the way.",
    built: "[EDIT: which parts you personally built]",
    hardPart: "[EDIT: write the hardest problem you hit and how you solved it]",
    note: "Team Visionaries, SIH 2026, problem statement 26190. My role: [EDIT]",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/SecureCase" }]
  },
  {
    id: "scholar-mentor",
    number: "03",
    title: "Scholar Mentor",
    featured: true,
    status: "[EDIT: shipped / live / in progress]",
    description: "Alumni mentorship platform connecting students and alumni. Authentication plus a relational PostgreSQL schema that supports multiple isolated institution communities on one codebase.",
    stack: ["React", "JavaScript", "Bootstrap", "Supabase", "PostgreSQL"],
    problem: "[EDIT]",
    built: "[EDIT]",
    hardPart: "[EDIT]",
    links: [{ label: "GitHub", href: "[EDIT]" }, { label: "Live", href: "[EDIT]" }]
  },
  {
    id: "ocr-summary",
    number: "04",
    title: "OCR Summary Generator",
    featured: false,
    status: "[EDIT]",
    description: "Extracts text from scanned documents with EasyOCR and produces extractive summaries without generative AI, using tokenization, stopword removal, and TF-IDF sentence scoring. Shortens text by roughly 30 to 40 percent.",
    stack: ["Python", "EasyOCR", "NLP", "TF-IDF"],
    problem: "[EDIT]",
    built: "[EDIT]",
    hardPart: "[EDIT]",
    links: [{ label: "GitHub", href: "[EDIT]" }]
  },
  {
    id: "edutech-assistance",
    number: "05",
    title: "EduTechAssistance",
    featured: false,
    status: "[EDIT: your role, e.g. forked and extended]",
    description: "AI-powered question paper generator and exam management platform. Educators upload course PDFs and generate balanced exam papers with a retrieval-augmented pipeline; students take timed exams with server-side countdown enforcement and autosave; teachers grade subjective answers in a side-by-side workspace with AI-suggested scores.",
    stack: ["Flask", "React", "Tailwind CSS", "Gemini API", "Docker", "PostgreSQL"],
    note: "Forked from developerskull/EduTechAssistance. My contributions: [EDIT: list exactly what you built or changed]",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/EduTechAssistance" }]
  },
  {
    id: "agroconnect",
    number: "06",
    title: "AgroConnect",
    featured: false,
    status: "[EDIT]",
    description: "Farmer portal built with vanilla PHP, MySQL and JavaScript. Farmers register, post crop details with investment and turnover data, and manage their profile; visitors search crops by name, region and farm area; an admin panel lets admins block or unblock farmers and moderate posts.",
    stack: ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "Apache"],
    note: "[EDIT: your role and who else worked on it]",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/AgroConnect" }]
  }
];
