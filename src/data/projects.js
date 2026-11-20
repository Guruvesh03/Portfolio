export const projects = [
  {
    id: "sentimate",
    number: "01",
    title: "Sentimate",
    featured: true,
    status: "in development (final-year project)",
    description: "Early-warning system for student mental health. A multilingual conversational survey screens for potential risk from structured responses. An XGBoost classifier with SHAP explanations lets reviewers see why each prediction was made. A counsellor dashboard is planned with consent-driven, human-reviewed follow-up instead of automated decisions.",
    stack: ["Python", "XGBoost", "SHAP", "FastAPI", "React", "Supabase"],
    problem: "Student mental health concerns often surface only after they become a crisis, and institutions have no structured, privacy-conscious way to notice early warning signs. Sentimate runs a multilingual conversational survey, estimates risk from the structured responses, and gives counsellors an explained, human-reviewed view instead of an automated verdict.",
    hardPart: "A risk score about a student's mental health cannot be a black box. The challenge was making the model's output explainable and safe to act on: pairing an XGBoost classifier with SHAP so a counsellor can see which responses drove each prediction, and designing the flow so follow-up is consent-driven and always reviewed by a person, never automated.",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/SentiMate-Ai" }]
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
    hardPart: "Making tamper evidence demonstrable without a backend. Every uploaded file is fingerprinted with a real SHA-256 hash of its bytes in the browser (Web Crypto API), so changing even one byte is caught, while roles, audit trail and version history had to be modeled client-side. The prototype is explicit that client-side checks demonstrate the idea but are not real security, which is why the FastAPI backend and storage layer are planned next.",
    note: "Team Visionaries, SIH 2026, problem statement 26190",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/SecureCase" }]
  },
  {
    id: "scholar-mentor",
    number: "03",
    title: "Scholar Mentor",
    featured: true,
    status: "academic project",
    description: "Alumni mentorship platform connecting students and alumni. Authentication plus a relational PostgreSQL schema that supports multiple isolated institution communities on one codebase.",
    stack: ["React", "JavaScript", "Bootstrap", "Supabase", "PostgreSQL"],
    problem: "Students have no structured way to reach alumni from their own institute for mentorship and career guidance, so those connections depend on personal networks. Scholar Mentor gives each institute its own community where students and alumni can connect.",
    hardPart: "Running many institutions on one codebase. The challenge was designing the relational PostgreSQL schema and authentication so each institute's students and alumni live in an isolated community and never see another institute's data.",
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/Scholar-Mentor" }]
  },
  {
    id: "ocr-summary",
    number: "04",
    title: "OCR Summary Generator",
    featured: false,
    status: "academic project",
    description: "Extracts text from scanned documents with EasyOCR and produces extractive summaries without generative AI, using tokenization, stopword removal, and TF-IDF sentence scoring. Shortens text by roughly 30 to 40 percent.",
    stack: ["Python", "EasyOCR", "NLP", "TF-IDF"],
    links: []
  },
  {
    id: "edutech-assistance",
    number: "05",
    title: "EduTechAssistance",
    featured: false,
    description: "AI-powered question paper generator and exam management platform. Educators upload course PDFs and generate balanced exam papers with a retrieval-augmented pipeline; students take timed exams with server-side countdown enforcement and autosave; teachers grade subjective answers in a side-by-side workspace with AI-suggested scores.",
    stack: ["Flask", "React", "Tailwind CSS", "Gemini API", "Docker", "PostgreSQL"],
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/EduTechAssistance" }]
  },
  {
    id: "agroconnect",
    number: "06",
    title: "AgroConnect",
    featured: false,
    status: "academic project",
    description: "Farmer portal built with vanilla PHP, MySQL and JavaScript. Farmers register, post crop details with investment and turnover data, and manage their profile; visitors search crops by name, region and farm area; an admin panel lets admins block or unblock farmers and moderate posts.",
    stack: ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "Apache"],
    links: [{ label: "GitHub", href: "https://github.com/Guruvesh03/AgroConnect" }]
  }
];
