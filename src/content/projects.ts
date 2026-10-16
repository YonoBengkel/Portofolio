import type { StaticImageData } from "next/image";
import dwTopProducts from "@/assets/images/dw-top-products.png";
import fallArchitecture from "@/assets/images/fall-architecture.webp";
import fallStateMachine from "@/assets/images/fall-state-machine.webp";
import bdcPipeline from "@/assets/images/bdc-pipeline.webp";
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
  {
    slug: "fall-detection",
    number: "05",
    category: "Applied AI for care",
    title: "Fall detection for a nursing home",
    cardTitle: "Fall Detection for a Nursing Home",
    subtitle:
      "Four cameras, and a decision about how long someone has been on the floor - which is a harder question than it sounds.",
    summary:
      "Watching four rooms for a resident who has fallen, and deciding when the silence has gone on long enough to raise an alarm.",
    type: "Team",
    teamLabel: "Team of 4",
    status: "Code only",
    context: "Intelligent Systems Project course",
    period: "Oct 2026",
    role: "I built the backend: the per-camera pipeline, the state machine, the database layer, the API and the tests. A teammate trained the model.",
    flow: ["Camera frame", "Posture per person", "Timer per person", "Alert saved", "Dashboard & Telegram"],
    tools: ["Python", "FastAPI", "YOLO11", "SQLite", "WebSocket", "React"],
    links: [
      { label: "GitHub repository (integration branch)", href: "https://github.com/0Raja0-RA/nursing-home-fall-detection/tree/integration" },
    ],
    cover: {
      src: fallArchitecture,
      alt: "Diagram of the system: camera to camera service to inference to state machine to alert service, then to database, WebSocket and Telegram",
      caption:
        "The path a frame takes. One alert goes three places, in that order. (Diagram in Indonesian.)",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "A resident who falls can lie on the floor for a long time before anyone walks past. A camera that can tell a standing person from a lying one sounds like enough, and it is not: the useful signal is not the posture in one frame, it is **how long** the posture has lasted, and the frames in between are where it gets difficult.",
          "So the system watches four rooms, decides per person how long they have been down, and when that crosses a threshold it writes the incident down, pushes a banner to the caregivers' dashboard, and sends a photo to their phones.",
        ],
      },
      {
        kind: "text",
        heading: "Five observations, not two",
        body: [
          "The first version of any detector like this has two answers: trigger posture, or not. That version is wrong in the one case that matters most.",
          "A resident lying on the floor who gets covered by a blanket, or ends up behind a chair, **stops being detected** - and they stop being detected at exactly the moment the situation is most dangerous. If losing the person resets the timer, the system goes quiet precisely when it should be shouting.",
          "So every frame becomes one of five observations, and each one does something different to the timer. A trigger posture advances it. A different posture rewinds it, but only after several consecutive frames, so one bad guess does not undo a real timer. A detection the model is not sure about **holds** the timer where it is, because an uncertain reading is not evidence of safety. Losing the person entirely holds it too, for a grace period, for the reason above. And a camera that has stopped sending frames at all is its own state, because a dead camera is not a quiet room.",
        ],
      },
      {
        kind: "figures",
        figures: [
          {
            src: fallStateMachine,
            alt: "State machine diagram: MONITORING to POSSIBLE_FALL after two seconds, to CONFIRMED_FALL after ten, with UNKNOWN for an offline camera",
            caption:
              "Four states and the conditions between them. A camera that stops sending frames leaves the loop entirely rather than being treated as a quiet room. (Diagram in Indonesian.)",
          },
        ],
      },
      {
        kind: "decisions",
        heading: "Decisions",
        items: [
          {
            title: "The timer belongs to the person, not the frame",
            body: "With more than one person in a room, a single timer per camera is wrong: somebody walking past would clear the timer of somebody on the floor. Everyone in the frame is detected, but while a timer is running only the person at the position that started it decides what happens to it.",
          },
          {
            title: "The alert is saved before it is sent",
            body: "Database first, then the dashboard, then the phones. A messaging service that is down must not be able to lose an incident, so a failed notification does not cancel the alert it was reporting.",
          },
          {
            title: "Cameras and thresholds live in the database",
            body: "Not in memory and not in environment variables. A caregiver who adds a camera or changes a threshold expects it to still be there after the machine restarts.",
          },
          {
            title: "Marking an incident handled closes it",
            body: "The banner clears on every screen at once, the camera goes back to monitoring, and the caregiver's note is kept against that incident rather than in a log nobody reads.",
          },
          {
            title: "The demo button forces the observation, not the alert",
            body: "There is a simulation button, because a demo cannot wait for someone to lie on the floor. It injects a trigger observation and nothing else: the timer, the cooldown, the save and the notification all run for real, and the alert it produces is labelled as a simulation.",
          },
        ],
      },
      {
        kind: "text",
        heading: "What the data could not support",
        body: [
          "The posture model has two modes. One is a custom detector trained on bounding boxes; the other reads posture from the angle of the spine using pose estimation. The second is the default, and the reason is the training set.",
          "The public fall-detection dataset the team used holds about fifteen hundred labelled images, and **twelve** of them are labelled as a person on the ground. A detector trained on that will read a person lying down as something in between, because it has barely seen the thing it is supposed to find. Rather than report a number that the data could not support, the model choice was moved into a setting, the pose route was made the default, and the limit was written down.",
        ],
      },
      {
        kind: "note",
        body: "The model weights and the database are deliberately not in the repository. The schema is, because it is written as code. The screenshots of the running dashboard are not here yet - they need the system running with its camera set, and this page will carry them rather than describe them.",
      },
    ],
  },
  {
    slug: "waste-image-labels",
    number: "06",
    category: "Data-centric machine learning",
    title: "When the labels are the problem",
    cardTitle: "When the Labels Are the Problem",
    subtitle:
      "A national image competition where the team's first move was to stop trusting the labels they had been handed.",
    summary:
      "Twenty-six thousand labelled images, and the suspicion - then the evidence - that a lot of the labels were wrong.",
    type: "Team",
    teamLabel: "Team",
    status: "Code only",
    context: "Satria Data, Big Data Challenge - national competition",
    period: "2026",
    role: "I worked the data-centric half: the anomaly quarantine, the confident-learning re-label pass, and the model that was trained on what came out of it. A teammate owned the document heuristic and a second architecture.",
    flow: ["Labelled images", "Quarantine", "Re-label", "Filter", "Grouped split", "Train"],
    tools: ["Python", "cleanlab", "OpenCV", "PyTorch", "Perceptual hashing"],
    links: [],
    cover: {
      src: bdcPipeline,
      alt: "Diagram: images arrive labelled, then pass through quarantine, re-labelling and a document filter before a duplicate-grouped split and training",
      caption:
        "The pipeline. This is a drawing of the process rather than a screenshot of it - the repository is private, and the figures from the notebooks are not exported yet.",
    },
    sections: [
      {
        kind: "text",
        heading: "The starting suspicion",
        body: [
          "The task was to sort photographs of waste into three classes, and the organisers supplied the labels. The usual move is to accept them and spend the time on architectures.",
          "The team did not. Looking through the set by eye turned up images that were obviously in the wrong class, and the question stopped being *which model* and became **how much of this labelling can be trusted at all**. That is a claim you have to prove rather than assert, so the work became about producing the evidence.",
        ],
      },
      {
        kind: "steps",
        heading: "How the labels were tested",
        items: [
          "Quarantine first: anomaly detection to pull out files that were corrupt, truncated or not a photograph at all, so later stages were not reasoning about noise.",
          "Confident learning to rank every image by how likely its given label was to be wrong, which turns a vague suspicion into a list somebody can actually review.",
          "A simple image heuristic for the one pattern the eye kept catching: scanned brochures and documents filed under organic waste. Thousands of them.",
          "Group near-duplicate images with perceptual hashing **before** splitting into training and validation, so the same photograph could not sit on both sides.",
        ],
      },
      {
        kind: "decisions",
        heading: "Decisions",
        items: [
          {
            title: "A flagged label is reviewed, not flipped",
            body: "Confident learning produces a ranking, not a verdict. Letting it rewrite labels automatically would have replaced the organisers' mistakes with its own, so what it produced was a review list and a record of what was changed.",
          },
          {
            title: "Duplicates are grouped before the split, not after",
            body: "This is the decision that costs you a nice number. Near-duplicate photographs across the split make a validation score look much better than the model deserves; grouping them first makes the score smaller and honest, which is the only kind worth reading.",
          },
          {
            title: "Every stage leaves a record",
            body: "Each pass writes down which images it moved, out of which class, and on what grounds. A data-cleaning step that cannot be argued with is indistinguishable from a bug.",
          },
        ],
      },
      {
        kind: "note",
        body: "The repository is private and stays private, so there is no link here. Two figures do exist in the notebooks - the mislabel review and a cluster scatter of the image embeddings - and this page will carry them instead of the diagram once they are exported.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
