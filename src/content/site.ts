// Everything about the person lives here. Edit text in this file; the pages pick it up.

export const profile = {
  name: "Ilham Bintang Satria",
  label: "Business process · Data · Applied AI",
  tagline:
    "I map how a business runs, organize its data, and turn both into practical recommendations and tools.",
  intro:
    "Applied Data Science student at Politeknik Elektronika Negeri Surabaya (PENS) and AI Engineer intern at a digital marketing agency for SMEs. I enjoy understanding how a business runs: mapping its processes, organizing its data, and turning both into practical recommendations and tools.",
  location: "Surabaya, East Java, Indonesia",
  email: "ilhambintang437@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/ilham-bintang-satria-100305blltrjttmr/",
    github: "https://github.com/YonoBengkel",
  },
  // Put your CV at public/cv.pdf and a "Download CV" button appears automatically.
  cvPath: "/cv.pdf",
};

export const atAGlance = [
  { label: "Studying", value: "Applied Data Science (D4), Politeknik Elektronika Negeri Surabaya, since 2024" },
  { label: "Working", value: "AI Engineer Intern at Ideola, a digital marketing agency for SMEs, since Jul 2026" },
  { label: "Leading", value: "Research sub-division, IEEE PENS Student Branch" },
  { label: "Based in", value: "Surabaya, East Java, Indonesia" },
];

export const howIWork = [
  {
    title: "Understand the process",
    body: "Start from how work actually flows today and where it breaks: who does what, with which data, and which decision comes next.",
  },
  {
    title: "Structure the data",
    body: "Bring scattered records into one consistent, traceable source that people can trust.",
  },
  {
    title: "Turn it into decisions",
    body: "Build dashboards and tools that explain their reasoning, so people can judge a recommendation instead of following it blindly.",
  },
];

export type OtherWork = { title: string; body: string; meta: string; href?: string };

export const otherWork: OtherWork[] = [
  {
    title: "Retail BI for a multi-branch minimart",
    body: "A sales dashboard tracking revenue, costs, profit, and margin by branch, fed by a star-schema warehouse.",
    meta: "Individual, Data Visualization & Data Warehousing courses",
  },
  {
    title: "Data science competitions",
    body: "Regular participant in national-level data competitions, working in teams on real-world datasets.",
    meta: "Team",
  },
];

export const experience = [
  {
    role: "AI Engineer Intern",
    org: "Ideola, digital marketing agency for SMEs",
    period: "Jul 2026 – present",
    points: [
      "Mapped the agency's lead-to-project flow and compared CRM, automation, and messaging tools.",
      "Built a WhatsApp sales-agent backend that reads client needs and turns them into project backlogs.",
      "Built the company website's blog and SEO setup, and maintain client websites per service package.",
    ],
  },
];

export const leadership = [
  {
    role: "Vice Head, Research & Education Department",
    org: "IEEE PENS Student Branch",
    period: "Jul 2025 – present",
    body: "Leading the research sub-division: setting the research roadmap, managing members' work, and running a community-service project that builds a machine for farmer groups around Surabaya.",
  },
  {
    role: "Staff of Legal Affairs",
    org: "Member Representative Council, HIMIT PENS",
    period: "Feb 2026 – present",
    body: "Monitoring the executive board and its events for compliance with the association's regulations.",
  },
  {
    role: "General Coordinator, Question Team",
    org: "The National Science and Social Olympiads",
    period: "Jan – Oct 2023",
    body: "Led a team of more than twenty people writing the questions for every round, under one review process.",
  },
];

// Event committees, which are jobs for one event rather than a seat in an organisation.
export const volunteering = [
  {
    role: "Steering Committee",
    event: "Dynamic ITDS 2025, the department's cadre programme",
    org: "HIMIT PENS",
    period: "Mar – May 2026",
    body: "Designed the programme from its target outcomes down to the parameters each participant was assessed on.",
  },
  {
    role: "Vice Coordinator, Election Committee",
    event: "General election",
    org: "HIMIT PENS",
    period: "Oct 2025 – Feb 2026",
    body: "Deputised for the coordinator in running the association's general election.",
  },
  {
    role: "Operations Division",
    event: "Pengenalan Komunitas 2025, the community introduction for new members",
    org: "HIMIT PENS",
    period: "Nov 2025",
    body: "Ran the floor logistics across the event's two weeks.",
  },
  {
    role: "Liaison Officer",
    event: "LKMM Pra-Dasar 2025, a student management training",
    org: "BEM PENS",
    period: "Jun 2026",
    body: "Looked after one group of participants from arrival to the closing session.",
  },
  {
    role: "Mentor",
    event: "Religious mentoring programme",
    org: "UKKI PENS",
    period: "2026",
    body: "Led a weekly discussion group for first-year students.",
  },
];

// National and inter-university data competitions. Every entry was a team entry at
// participant level: no placements are claimed.
export const competitions = [
  {
    name: "Satria Data, Big Data Challenge",
    org: "Puspresnas",
    year: "2025 and 2026",
    body: "Campus representative for PENS twice. The 2025 task combined images and audio; 2026 was relabelling documents.",
  },
  {
    name: "Data Science ARA 7.0",
    org: "HMIT, Institut Teknologi Sepuluh Nopember",
    year: "2026",
    body: "Finding road damage in field photographs, including paving-block surfaces where the damage barely shows.",
  },
  {
    name: "Gelar Rasa",
    org: "HIMASADA, UPN Veteran Jawa Timur",
    year: "2025",
    body: "A personal-care sales dataset: demand over time, and products taking sales from each other.",
  },
  {
    name: "Gelar Rasa",
    org: "HIMASADA, UPN Veteran Jawa Timur",
    year: "2024",
    body: "Finding fraudulent transactions in sales records.",
  },
  {
    name: "Gammafest",
    org: "Institut Pertanian Bogor",
    year: "2026",
    body: "Predicting match results from team form and ranking history.",
  },
  {
    name: "Datathon by RISTEK",
    org: "Fasilkom, Universitas Indonesia",
    year: "2026",
    body: "Forecasting traffic across a city road network from the way its roads connect.",
  },
];

export const education = {
  degree: "Applied Data Science (D4)",
  school: "Politeknik Elektronika Negeri Surabaya (PENS)",
  period: "2024 – present",
  coursework:
    "Business analytics, data warehousing, databases, data management, data visualization, applied statistics, data mining, and machine learning.",
};

export const toolbox = [
  { group: "Data & analytics", items: ["SQL", "Python (pandas, scikit-learn)", "Excel", "Statistical testing"] },
  { group: "BI & visualization", items: ["Power BI", "Tableau", "Looker Studio", "Streamlit"] },
  { group: "Data engineering", items: ["Star schema modelling", "ETL", "Apache Airflow", "Docker"] },
  { group: "AI & development", items: ["Machine learning", "LLM agents", "FastAPI", "React & TypeScript"] },
];

// One line, used on the contact page and in the CV page's header.
export const openTo = "Open to a data internship from January 2027, for at least four months.";
