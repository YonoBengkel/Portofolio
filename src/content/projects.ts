import type { StaticImageData } from "next/image";
import dwTopProducts from "@/assets/images/dw-top-products.png";
import ewsAdvice from "@/assets/images/ews-advice.jpg";
import ewsAlert from "@/assets/images/ews-alert.jpg";
import ewsEvaluation from "@/assets/images/ews-evaluation.jpg";
import supplierActive from "@/assets/images/supplier-active.jpg";
import supplierAudit from "@/assets/images/supplier-audit.jpg";
import warungkuDistributor from "@/assets/images/warungku-distributor-screens.jpg";
import warungkuFlow from "@/assets/images/warungku-flow-b2b.png";
import warungkuOwner from "@/assets/images/warungku-owner-screens.jpg";

// Case studies. Text follows one rule: explain the problem, the work, and the reasoning; no bragging metrics.
// Use **double asterisks** for bold text inside any string.

export type Figure = { src: StaticImageData; alt: string; caption: string; narrow?: boolean };

export type Section =
  | { kind: "text"; heading: string; body: string[] }
  | { kind: "steps"; heading: string; items: string[] }
  | { kind: "list"; heading: string; items: string[] }
  | { kind: "decisions"; heading: string; items: { title: string; body: string }[] }
  | { kind: "figures"; figures: Figure[]; columns?: 1 | 2 }
  | { kind: "diagram"; diagram: "pipeline" | "star-schema"; caption: string }
  | { kind: "note"; body: string };

export type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  cardTitle: string;
  subtitle: string;
  summary: string;
  type: "Team" | "Individual";
  teamLabel: string;
  /** What a reader can actually open today. Honest about prototypes and dead demos. */
  status: "Live" | "Prototype" | "Code only";
  context: string;
  period: string;
  role: string;
  /** The project read left to right in four to six steps. Shown as a chain above the case study. */
  flow: string[];
  tools: string[];
  links: { label: string; href: string }[];
  /** The project's own colour: its home tile, the band at the top of its page, and the "next case study" link. */
  color: { tile: string; ink: "light" | "dark" };
  cover: Figure;
  /** Show a diagram instead of the cover image at the top of the case study and on the home tile. */
  heroDiagram?: { diagram: "pipeline" | "star-schema"; caption: string };
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "warungku",
    number: "01",
    category: "Business process & product design",
    title: "Warungku: from cashier data to stock and purchasing decisions",
    cardTitle: "Warungku",
    subtitle:
      "A companion app for small food & beverage businesses, built to sit beside the cashier app they already use.",
    summary:
      "Inventory and purchasing for small food & beverage businesses, designed around their existing cashier app.",
    type: "Team",
    teamLabel: "Team of 4",
    status: "Prototype",
    context: "Data Analytics Project course, supply-chain project",
    period: "Sep 2026 – ongoing",
    role: "Our team had no fixed job split; I mainly worked on the logic: the rules that connect sales, stock, forecasts, orders, and goods receipt.",
    flow: ["Cashier sales", "Stock ledger", "Restock forecast", "Distributor order", "Goods receipt"],
    tools: ["React", "TypeScript", "Process flowcharts", "SWOT"],
    links: [{ label: "GitHub repository", href: "https://github.com/YonoBengkel/Warungku" }],
    color: { tile: "#0C726C", ink: "light" }, // the teal of the Warungku app itself
    cover: {
      src: warungkuOwner,
      alt: "Warungku business-owner screens: daily to-do list, stock forecast with reasons, and goods receipt",
      caption:
        "Business-owner portal from the working prototype: what needs attention today, a forecast that explains itself, and the goods-receipt screen, the only place where stock goes up. (Interface in Indonesian.)",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "Small F&B businesses already record every sale in a cashier app, but the data stops there. Nobody tracks what is left in the storeroom, so items run out mid-rush, perishables are over-bought and wasted, and orders to distributors are placed from memory over chat, with no record to check when a delivery comes up short.",
          "Distributors face the mirror image: orders arrive through scattered channels, and customers keep calling to ask where their goods are.",
        ],
      },
      {
        kind: "text",
        heading: "The idea",
        body: [
          "Instead of replacing the cashier app, Warungku sits beside it and takes over three jobs nobody was doing: counting stock, estimating next month's needs, and ordering from distributors.",
        ],
      },
      {
        kind: "steps",
        heading: "How the process works",
        items: [
          "Sales recorded in the cashier app reduce stock automatically.",
          "Usage history builds into a forecast for next month, shown together with its reasons.",
          "The owner adjusts the suggestion and orders from a distributor in the same app.",
          "The distributor accepts or rejects the order (with a reason), then prepares and ships it.",
          "The owner confirms what actually arrived; only then does stock go up.",
        ],
      },
      {
        kind: "decisions",
        heading: "Design decisions that keep the numbers trustworthy",
        items: [
          { title: "Companion, not replacement", body: "Owners keep the cashier app they already know, so adoption does not depend on switching systems." },
          { title: "One gate for stock increases", body: "Stock rises only when goods are confirmed at receipt, and every manual adjustment must carry a reason, so the storeroom and the system stay in sync." },
          { title: "Forecasts that explain themselves", body: "Each suggestion shows the usage trend and why it was made, so owners can judge it rather than trust a number blindly." },
          { title: "One contract, one item", body: "Monthly quotas, prices, and fulfilment stay traceable item by item." },
          { title: "Forecasting as a separate service", body: "If the model fails, the rest of the app keeps working." },
        ],
      },
      {
        kind: "figures",
        figures: [
          {
            src: warungkuDistributor,
            alt: "Distributor portal screens: dashboard, accept or reject orders, order tracking, and order map",
            caption: "Distributor portal: incoming orders, accept or reject with a reason, order tracking, and a map of who is ordering what. (Interface in Indonesian.)",
          },
        ],
      },
      {
        kind: "figures",
        figures: [
          {
            src: warungkuFlow,
            alt: "B2B flowchart from distributor sign-up to goods received",
            caption: "B2B process, from distributor sign-up to goods received, including the rejection and incomplete-documents paths. (In Indonesian.)",
            narrow: true,
          },
        ],
      },
      {
        kind: "text",
        heading: "Who uses it",
        body: [
          "Business owners (with Owner, Manager, and Cashier permissions), distributors through their own portal, and an admin who verifies businesses before they sign contracts.",
        ],
      },
      {
        kind: "text",
        heading: "Deliberately out of scope",
        body: [
          "Selling prices and profit (they already live in the cashier app), payment processing (settled directly between owner and distributor), and support for more than one cashier app in the first version.",
        ],
      },
      {
        kind: "text",
        heading: "Status and next steps",
        body: [
          "Both portals are prototyped end to end on realistic sample data, and the process is documented with B2B and B2C flowcharts, a SWOT analysis, and a timeline. Next: the backend, a real forecasting model, and the admin portal, by January 2027.",
        ],
      },
    ],
  },
  {
    slug: "supplier-decision-support",
    number: "02",
    category: "Procurement analytics",
    title: "Supplier Decision-Support Dashboard",
    cardTitle: "Supplier Decision-Support Dashboard",
    subtitle: "Helping a procurement team choose suppliers on several criteria at once, not on the lowest unit price alone.",
    summary: "Choosing and reviewing suppliers with weighted criteria instead of the lowest price alone.",
    type: "Team",
    teamLabel: "Team project",
    status: "Live",
    context: "Business Analytics for Data Science course",
    period: "Mar – Jun 2026",
    role: "I designed the scoring approach and its underlying math, and wrote the first version of the app; a teammate later upgraded it.",
    flow: ["Purchase records", "Criteria the buyer weights", "Score per supplier", "Ranking", "Expiry audit"],
    tools: ["Python", "pandas", "Streamlit", "Plotly", "SAW & TOPSIS scoring"],
    links: [{ label: "Live app", href: "https://supplier-procurement-analysis.streamlit.app/" }],
    color: { tile: "#F2CFC6", ink: "dark" }, // pink, like the purchase-order copy
    cover: {
      src: supplierActive,
      alt: "Supplier recommendation per product with criteria weights set in the sidebar",
      caption: "Recommendation per product, with criteria weights set in the sidebar. (Interface in Indonesian.)",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "Picking suppliers by gut feeling or by the cheapest unit price hides real risks: unsafe stock levels, slow-moving goods, items near expiry, and a higher total cost of procurement.",
        ],
      },
      {
        kind: "steps",
        heading: "What we did",
        items: [
          "Derived missing measures from warehouse records, such as shelf life at arrival (negative means the goods arrived already expired).",
          "Split the question in two: active products look forward (who should we buy from next?), discontinued ones look back (who should we drop, and who deserves another chance?).",
          "Averaged each supplier's repeated deliveries so a single delivery does not decide the score.",
          "Scored suppliers with weights managers set themselves (price, turnover, shelf life), using two scoring methods side by side.",
          "Showed a recommended supplier, a backup, and a ranking that updates as the weights change.",
        ],
      },
      {
        kind: "text",
        heading: "Why it is built this way",
        body: [
          "The tool supports the decision instead of making it: managers see how rankings shift as priorities change, and the audit turns past failures into a drop list and a renegotiation shortlist.",
        ],
      },
      {
        kind: "figures",
        columns: 1,
        figures: [
          {
            src: supplierAudit,
            alt: "Post-mortem audit of discontinued products and their suppliers",
            caption: "Post-mortem audit of discontinued products and their suppliers. (Interface in Indonesian.)",
          },
        ],
      },
    ],
  },
  {
    slug: "sales-data-warehouse",
    number: "03",
    category: "Data engineering & BI",
    title: "Sales Data Warehouse: CRM & ERP Integration",
    cardTitle: "Sales Data Warehouse: CRM & ERP Integration",
    subtitle: "One consistent, trusted view of sales for profitability and customer analysis.",
    summary: "One trusted view of sales from two systems that did not agree with each other.",
    type: "Individual",
    teamLabel: "Individual",
    status: "Code only",
    context: "Data Warehousing course, final project",
    period: "Jun 2026",
    role: "Designed and built the whole pipeline on my own, from raw files to data marts.",
    flow: ["CRM and ERP exports", "Raw copy kept", "Cleaned and matched", "Star schema", "Data marts"],
    tools: ["Python", "pandas", "SQL", "SQLite", "Apache Airflow", "Docker"],
    links: [{ label: "GitHub repository", href: "https://github.com/YonoBengkel/Medallion" }],
    color: { tile: "#E8B94A", ink: "dark" }, // the gold layer of the medallion pipeline
    cover: {
      src: dwTopProducts,
      alt: "Bar chart of the top five product subcategories by profit",
      caption: "Example output from the profitability mart: top subcategories by profit. (Chart labels in Indonesian.)",
    },
    heroDiagram: { diagram: "pipeline", caption: "Each layer has one job, so a problem can be traced to the step that caused it." },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "Customer, product, and sales records were split between a CRM and an ERP. The two systems used different ID formats and codes, and the raw files contained gaps and broken dates, so no report built on them could be trusted as-is.",
        ],
      },
      {
        kind: "list",
        heading: "What I built",
        items: [
          "**Raw layer:** an untouched copy of every source file, stamped with where and when each row came in.",
          "**Clean layer:** IDs matched across the two systems, codes unified, dates repaired, and missing costs filled.",
          "**Star schema:** customer, product, and date dimensions around a sales fact table.",
          "**Data marts:** ready-made views for product profitability, customer demographics, sales trends, and top spenders.",
          "The whole chain runs automatically every day, in order.",
        ],
      },
      {
        kind: "list",
        heading: "Key decisions",
        items: [
          "Keep raw data untouched, so every number can be traced back to its source.",
          "Fix the data once, in one layer, so every report agrees.",
          "Use the product version that was valid on each order date, so historical margins stay correct when prices change.",
          "Keep returns as real business events instead of deleting negative sales.",
        ],
      },
      { kind: "diagram", diagram: "star-schema", caption: "The star schema at the heart of the warehouse." },
      {
        kind: "figures",
        figures: [
          {
            src: dwTopProducts,
            alt: "Bar chart of the top five product subcategories by profit",
            caption: "Example output from the profitability mart: top subcategories by profit. (Chart labels in Indonesian.)",
            narrow: true,
          },
        ],
      },
    ],
  },
  {
    slug: "quality-early-warning",
    number: "04",
    category: "Applied AI for operations",
    title: "Quality Early-Warning System for an Iron-Ore Flotation Plant",
    cardTitle: "Quality Early-Warning System",
    subtitle: "Warning operators about impure output before it reaches the lab, and telling them what to adjust.",
    summary: "Warning plant operators about impure output before it reaches the lab, with advice on what to adjust.",
    type: "Individual",
    teamLabel: "Individual",
    status: "Code only",
    context: "Recommender Systems course, final project",
    period: "Jun 2026",
    role: "Built it end to end on my own: data preparation, model, advice rules, API, and dashboard.",
    flow: ["Plant sensor readings", "Impurity model", "Cost-weighted threshold", "Alert", "What to adjust"],
    tools: ["Python", "scikit-learn", "FastAPI", "React"],
    links: [{ label: "GitHub repository", href: "https://github.com/YonoBengkel/Tambang" }],
    color: { tile: "#7A2E25", ink: "light" }, // hematite, the iron ore itself
    cover: {
      src: ewsEvaluation,
      alt: "Dashboard flags a likely high-silica batch and recommends an action for the operator",
      caption: "The dashboard flags a likely high-silica batch, names the sensor driving it, and suggests the fix. (Interface in Indonesian.)",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "In flotation, the silica impurity in the iron-ore concentrate is only known after a lab test that can take up to an hour. By then the plant has already produced more off-spec material, and because bad batches are rare, routine monitoring tends to miss them.",
        ],
      },
      {
        kind: "steps",
        heading: "What I built",
        items: [
          "Defined \"at risk\" output as the highest quarter of historical silica readings.",
          "Cleaned the plant's sensor data, including number formats and gaps along the time sequence.",
          "Trained a model that treats a missed defect as more costly than a false alarm.",
          "Tuned the alert threshold toward catching defective batches rather than avoiding extra checks.",
          "For each alert, found the sensor furthest from its normal range and turned it into a concrete action for the operator.",
          "Delivered it as a dashboard where operators enter plant readings and see the verdict and the advice.",
        ],
      },
      {
        kind: "decisions",
        heading: "Key decisions",
        items: [
          { title: "Early warning over exact prediction", body: "Operators need to know when to act, not the precise impurity value." },
          { title: "Advice, not just an alarm", body: "An alert is only useful if it says what to adjust." },
        ],
      },
      {
        kind: "figures",
        columns: 2,
        figures: [
          { src: ewsAlert, alt: "Close-up of the anomaly alert", caption: "Close-up: the alert, with the impurity limit it refers to." },
          { src: ewsAdvice, alt: "Close-up of the recommended action", caption: "Close-up: the sensor driving the alert and the recommended action." },
        ],
      },
      {
        kind: "note",
        body: "Data: the public \"Quality Prediction in a Mining Process\" dataset (E. Magalhães, Kaggle).",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
