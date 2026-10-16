// Everything about the person lives here. Edit text in this file; the pages pick it up.

import type { StaticImageData } from "next/image";
import araCert from "@/assets/images/certs/ara-7.webp";
import compfestCert from "@/assets/images/certs/compfest-18.webp";
import dqlabCert from "@/assets/images/certs/dqlab-sql.webp";
import gammafestCert from "@/assets/images/certs/gammafest-2026.webp";
import gelarRasa24Cert from "@/assets/images/certs/gelar-rasa-2024.webp";
import gelarRasa25Cert from "@/assets/images/certs/gelar-rasa-2025.webp";
import sicCert from "@/assets/images/certs/sic-7.webp";
import caturEltafestCert from "@/assets/images/certs/catur-eltafest.webp";
import caturItsCert from "@/assets/images/certs/catur-its.webp";
import caturUnesaCert from "@/assets/images/certs/catur-unesa.webp";
import dynamicCert from "@/assets/images/certs/dynamic-himit.webp";
import komunitasCert from "@/assets/images/certs/pengenalan-komunitas.webp";
import lkmmLoCert from "@/assets/images/certs/lkmm-lo.webp";
import mentoringCert from "@/assets/images/certs/mentoring-ukki.webp";
import lkmmDasarCert from "@/assets/images/certs/lkmm-dasar.webp";
import lkmmPraDasarCert from "@/assets/images/certs/lkmm-pra-dasar.webp";
import ieeeSeminarCert from "@/assets/images/certs/ieee-seminar.webp";
import oppCert from "@/assets/images/certs/opp.webp";

/**
 * A scan of the certificate itself, where there is one. Rendered from his own folder by
 * tools/certs-to-webp.py; page 1 only, because a second page is a score sheet and this
 * site does not print scores. Every one was read before it was committed: none carries a
 * student number of his, only the committee's own.
 */
export type Scan = StaticImageData;

export const profile = {
  name: "Ilham Bintang Satria",
  label: "Business process · Data · Applied AI",
  tagline:
    "I map how a business runs, organize its data, and turn both into practical recommendations and tools.",
  intro:
    "Applied Data Science student at Politeknik Elektronika Negeri Surabaya (PENS) and AI Engineer at a digital marketing agency for SMEs. I enjoy understanding how a business runs: mapping its processes, organizing its data, and turning both into practical recommendations and tools.",
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
  { label: "Working", value: "AI Engineer at Ideola, a digital marketing agency for SMEs, since Jul 2026" },
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
    role: "AI Engineer",
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
    scan: dynamicCert,
  },
  {
    role: "Vice Coordinator, Election Committee",
    event: "General election",
    org: "HIMIT PENS",
    period: "Oct 2025 – Feb 2026",
    body: "Deputised for the coordinator in running the association's general election.",
    // No scan: the only document for this one is the committee decree, which lists about
    // seventy students' full names against their NRP, his own among them.
  },
  {
    role: "Operations Division",
    event: "Pengenalan Komunitas 2025, the community introduction for new members",
    org: "HIMIT PENS",
    period: "Nov 2025",
    body: "Ran the floor logistics across the event's two weeks.",
    scan: komunitasCert,
  },
  {
    role: "Liaison Officer",
    event: "LKMM Pra-Dasar 2025, a student management training",
    org: "BEM PENS",
    period: "Jun 2026",
    body: "Looked after one group of participants from arrival to the closing session.",
    scan: lkmmLoCert,
  },
  {
    role: "Mentor",
    event: "Religious mentoring programme",
    org: "UKKI PENS",
    period: "2026",
    body: "Led a weekly discussion group for first-year students.",
    scan: mentoringCert,
  },
];

/**
 * Training and seminars he sat in, rather than ran. They are not committee seats and not
 * competitions, so they are neither on the home page nor in the list above: they sit at
 * the foot of the organisations page, which is where a reader looking for this kind of
 * thing would go.
 */
export const training = [
  {
    title: "LKMM Tingkat Dasar",
    org: "BEM PENS",
    period: "Apr 2025",
    body: "The second tier of the student management training: running a programme rather than joining one.",
    scan: lkmmDasarCert,
  },
  {
    title: "LKMM Tingkat Pra-Dasar",
    org: "BEM PENS",
    period: "Oct – Nov 2024",
    body: "The first tier, taken in his first semester.",
    scan: lkmmPraDasarCert,
  },
  {
    title: "Engineering Your Brand",
    org: "IEEE PENS Student Branch",
    period: "May 2026",
    body: "A seminar on how an engineer's work reads to the people outside engineering.",
    scan: ieeeSeminarCert,
  },
  {
    title: "Departmental orientation (OPP)",
    org: "HIMIT PENS",
    period: "Feb 2025",
    body: "The department's own introduction programme for first-year students.",
    // Three student numbers are painted out of this one before it is rendered: his own,
    // which he said he did not mind showing, and the two signatories', which are not his
    // to publish. The redaction is burnt into the pixels, not an overlay.
    scan: oppCert,
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
    scan: araCert,
  },
  {
    name: "Gelar Rasa",
    org: "HIMASADA, UPN Veteran Jawa Timur",
    year: "2025",
    body: "A personal-care sales dataset: demand over time, and products taking sales from each other.",
    scan: gelarRasa25Cert,
  },
  {
    name: "Gelar Rasa",
    org: "HIMASADA, UPN Veteran Jawa Timur",
    year: "2024",
    body: "Finding fraudulent transactions in sales records.",
    scan: gelarRasa24Cert,
  },
  {
    name: "Gammafest",
    org: "Institut Pertanian Bogor",
    year: "2026",
    body: "Predicting match results from team form and ranking history.",
    scan: gammafestCert,
  },
  {
    name: "Datathon by RISTEK",
    org: "Fasilkom, Universitas Indonesia",
    year: "2026",
    body: "Forecasting traffic across a city road network from the way its roads connect.",
  },
  {
    name: "Data Analytics Dash",
    org: "COMPFEST 18, Universitas Indonesia",
    year: "2026",
    body: "An analytics round run over August and September, against teams from across the country.",
    scan: compfestCert,
  },
];

/**
 * Chess. Not data work, and it does not pretend to be - but it is competitive, it is
 * where his placements are, and he asked for all of it. The belt on the home page reads
 * each card's own result rather than labelling them all Participant, because one of these
 * is a second place and flattening that would be the opposite of the rule.
 */
export const chess = [
  {
    name: "ELTAFEST Chess",
    org: "Lembaga Minat Bakat PENS",
    year: "2025",
    result: "2nd place",
    body: "The institute's own tournament, run across four weeks in September and October.",
    scan: caturEltafestCert,
  },
  {
    name: "ITS Chess Tournament, Open",
    org: "UKM Catur, Institut Teknologi Sepuluh Nopember",
    year: "2025",
    result: "Participant",
    body: "The open category, played in one day in Surabaya.",
    scan: caturItsCert,
  },
  {
    name: "UNESA Rapid Chess Tournament, Open",
    org: "UKMPC, Universitas Negeri Surabaya",
    year: "2025",
    result: "Participant",
    body: "Rapid format, open category, played at BG Junction in Surabaya.",
    scan: caturUnesaCert,
  },
];

// Awards and certificates. Same rule as the competitions list: only what is on the CV
// and backed by a certificate, with the awarding body named.
export const achievements = [
  {
    title: "Bronze Medal, Thailand International Mathematical Olympiad",
    org: "TIMO",
    year: "2023",
    body: "An international mathematics olympiad; the medal was awarded at the final round.",
  },
  {
    title: "Samsung Innovation Campus Batch 7 — Python Programming",
    org: "Samsung Electronics Indonesia",
    year: "2025",
    body: "A selective programme in Python and its use for data work, run with the company's own engineers.",
    scan: sicCert,
  },
  {
    title: "Guide to Learn SQL with AI",
    org: "DQLab, with Universitas Multimedia Nusantara",
    year: "2025",
    body: "A course on querying with SQL and on where a language model helps with that work and where it does not.",
    scan: dqlabCert,
  },
  {
    title: "TOEFL 563",
    org: "English proficiency",
    year: "2022",
    body: "Upper-intermediate. Every case study on this site was written in English first.",
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
// Ilham asked for this on 2026-10-17: he wants the page to read as somebody looking
// for a data role, not for a placement. It overrides the additions-only rule on this
// file, at his direct instruction.
export const openTo = "Open to work in data positions.";
