import type { StaticImageData } from "next/image";
import dwTopProducts from "@/assets/images/dw-top-products.png";
import fallArchitecture from "@/assets/images/fall-architecture.webp";
import fallStateMachine from "@/assets/images/fall-state-machine.webp";
import bdcPipeline from "@/assets/images/bdc-pipeline.webp";
import ispuDashboard from "@/assets/images/ispu-dashboard.webp";
import agentRetrieval from "@/assets/images/agent-retrieval.webp";
import ewsAdvice from "@/assets/images/ews-advice.jpg";
import ewsAlert from "@/assets/images/ews-alert.jpg";
import ewsEvaluation from "@/assets/images/ews-evaluation.jpg";
import supplierActive from "@/assets/images/supplier-active.jpg";
import supplierAudit from "@/assets/images/supplier-audit.jpg";
import turnifyDistributor from "@/assets/images/turnify-distributor-screens.jpg";
import warungkuFlow from "@/assets/images/warungku-flow-b2b.png";
import turnifyOwner from "@/assets/images/turnify-owner-screens.jpg";

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
    slug: "turnify-flow",
    number: "01",
    category: "Supply-chain analytics",
    title: "Turnify Flow: from cashier data to stock and purchasing decisions",
    cardTitle: "Turnify Flow",
    subtitle:
      "A companion app for small food & beverage businesses, built to sit beside the cashier app they already use.",
    summary:
      "Stock, demand forecasts and distributor choice for small food & beverage businesses, designed around the cashier app they already use.",
    type: "Team",
    teamLabel: "Team of 4",
    status: "Prototype",
    context: "Data Analytics Project course, supply-chain project",
    period: "Sep 2026 – ongoing",
    role: "Our team had no fixed job split; I mainly worked on the logic: the rules that connect sales, stock, forecasts, orders, and goods receipt.",
    flow: ["Cashier receipts", "Stock ledger", "Demand forecast", "Distributor choice", "Goods receipt"],
    tools: ["FastAPI", "PostgreSQL", "LightGBM", "React", "TypeScript", "Docker"],
    // The repository kept the project's first name when the app was renamed on 12 Oct 2026.
    links: [{ label: "GitHub repository", href: "https://github.com/YonoBengkel/Warungku" }],
    cover: {
      src: turnifyOwner,
      alt: "Business-owner screens: the daily home page, a stock forecast with the reasoning behind it, and goods receipt",
      caption:
        "Business-owner portal: what needs attention today, a forecast that shows its working and names its model, and the goods-receipt screen, the only place where stock goes up. (Interface in Indonesian.)",
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
          "Instead of replacing the cashier app, Turnify Flow sits beside it. It reads the receipts the cashier app already produces, keeps the storeroom count nobody was keeping, forecasts what the coming weeks will need, and suggests which distributor to order from.",
          "Businesses that make their own goods, such as a home kitchen selling sambal to shops, record their cooking sessions and shipments in the same app, so the ingredients they use are counted exactly like ingredients sold over a counter.",
        ],
      },
      {
        kind: "steps",
        heading: "How the process works",
        items: [
          "Each receipt from the cashier app lowers stock, recorded as a movement in a ledger.",
          "Daily usage becomes a forecast for the next 30 days, given as a range rather than one number.",
          "An item is flagged as running low when what is left would not cover the high end of that range for as long as a delivery takes.",
          "The app suggests how much to buy and from which distributor, weighing how reliable each one has been against its price. The owner adjusts the suggestion and orders in the same app.",
          "The distributor accepts or rejects the order (with a reason), then prepares and ships it.",
          "The owner confirms what actually arrived: on time, the right amount, in good condition. Only then does stock go up, and that check is what the distributor suggestion learns from.",
        ],
      },
      {
        kind: "text",
        heading: "Three questions, three engines",
        body: [
          "**How much, and when?** The first engine forecasts each item's demand as a low, a middle and a high estimate, with one model shared by every item. The range matters more than the middle: the safety level is set from the high estimate over the delivery time, so the forecast's own uncertainty becomes the size of the buffer instead of being hidden by it. A day the item was sold out is treated as **censored**: zero sales that day says the shelf was empty, not that nobody wanted it.",
          "**Which distributor?** The second engine keeps a running belief about how reliable each distributor is, updated by every delivery check, and balances trying a less-known distributor against sticking with the one that has proved itself before weighing reliability against price. In the simulation, always picking the cheapest did worse than choosing at random, because the cheapest distributor there was designed to be the least reliable.",
          "**Which customers are drifting away?** The third engine works for the distributor. It groups their customers by how recently, how often and how much they order, together with the kind of business and what they buy, so a distributor can see which customers are dependable and which are starting to slip.",
        ],
      },
      {
        kind: "decisions",
        heading: "Design decisions that keep the numbers trustworthy",
        items: [
          { title: "Companion, not replacement", body: "Owners keep the cashier app they already know, so adoption does not depend on switching systems." },
          { title: "One gate for stock increases", body: "Stock rises only when goods are confirmed at receipt, and every manual adjustment must carry a reason, so the storeroom and the system stay in sync." },
          { title: "Forecasts that explain themselves", body: "Each suggestion shows the usage trend and why it was made, and the app names the method behind each engine, so owners can judge a suggestion rather than trust it blindly." },
          { title: "One contract, one item", body: "Monthly quotas, prices, and fulfilment stay traceable item by item." },
          {
            title: "Models write, the app reads",
            body: "The model service writes its results into tables on a schedule (the forecast nightly, the other two engines every four hours), and the app only ever reads those tables. Nothing calls a model while a page is loading, so when the model service is down the portal still opens with the last numbers it has, marked as not fresh.",
          },
        ],
      },
      {
        kind: "figures",
        figures: [
          {
            src: turnifyDistributor,
            alt: "Distributor portal screens: home page, accepting or rejecting orders, delivery tracking, and a map of who is ordering",
            caption: "Distributor portal: what needs a decision today, incoming orders to accept or reject with a reason, delivery tracking, and a map of who is ordering what. (Interface in Indonesian.)",
          },
        ],
      },
      {
        kind: "figures",
        figures: [
          {
            src: warungkuFlow,
            alt: "B2B flowchart from distributor sign-up to goods received",
            caption: "B2B process, from distributor sign-up to goods received, including the rejection and incomplete-documents paths. Drawn before the rename, when the project was still called Warungku. (In Indonesian.)",
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
        heading: "What the data can and cannot say",
        body: [
          "Every engine was tuned on a simulation the team designed: 400 days of 70 small businesses and one producer. That includes the decision to make the cheapest distributor the least reliable, so the second engine doing well on that data says more about the simulation than about real distributors.",
          "The first engine's method was also tested on a real bakery's sales, but not yet on a real warung. The course set a 5% error target. It is met for the bakery's revenue, over only six test weeks, and not for weekly units per item, where the error is around 23%.",
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
          "The backend, the three engines and both portals run end to end on the simulated data, packaged as Docker images that start with one script. Still open: a connector to a real cashier app (the receipt format is defined and tested), notifications sent by the server rather than worked out in the browser, real delivery tracking instead of an estimate along a straight line, and a test on a real warung's data.",
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
  {
    slug: "air-quality-index",
    number: "07",
    category: "Forecasting & public data",
    title: "A day-ahead air quality index for East Java",
    cardTitle: "Day-Ahead Air Quality for East Java",
    subtitle:
      "Turning a government index into something a reader can act on, including the rule that says when a day does not count.",
    summary:
      "A dashboard that projects each district's air quality a day ahead, and is honest about the hours it did not get.",
    type: "Team",
    teamLabel: "Team of 3",
    status: "Live",
    context: "Web Service Technology course",
    period: "2026",
    role: "Mine was the index conversion and the model notebook: turning raw hourly readings into the official government index under its own rules, and the forecasting work behind the day-ahead numbers. The dashboard itself and the deployment were a teammate's.",
    flow: ["Hourly readings", "Official index", "Day-ahead forecast", "Checked against what arrived"],
    tools: ["Python", "pandas", "scikit-learn", "FastAPI"],
    links: [{ label: "Live dashboard", href: "https://web-prediksi-ispu.vercel.app/" }],
    cover: {
      src: ispuDashboard,
      alt: "The dashboard header, a 24-hour prediction slider, and summary cards for the most and least polluted districts",
      caption:
        "The live dashboard. The map below this panel currently renders a tile-provider watermark; that is a deployment key, not a design choice.",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "Air quality is published as hourly concentrations for several pollutants, which is useful to an instrument and useless to a person. The government index, ISPU, is what a person can act on - but turning readings into it is not an average.",
          "The rule that matters is the one about missing data: a day only counts when enough of its hours were actually measured. A sensor that was down for most of a day must not produce a confident-looking number, and the obvious implementation - average what you have - produces exactly that.",
        ],
      },
      {
        kind: "decisions",
        heading: "Decisions",
        items: [
          {
            title: "The coverage rule is enforced, not assumed",
            body: "The conversion checks how many hours a day actually has before it will report an index for it. A day that does not clear the bar is reported as not measured rather than as clean air.",
          },
          {
            title: "Yesterday's forecast is checked against today's reading",
            body: "A forecast that is never compared to what arrived is a claim nobody can test. Each earlier prediction is held against the reading that later came in, so the dashboard can be wrong in public.",
          },
          {
            title: "The index is computed per pollutant, then reduced",
            body: "ISPU is defined per pollutant with its own breakpoints, and the day's figure is the worst of them rather than their average - because the point of the index is the thing that would hurt you.",
          },
        ],
      },
      {
        kind: "note",
        body: "This was a team of three and the repository belongs to a teammate, so there is no repository link here - only the live dashboard. What is mine is stated above rather than implied by the page.",
      },
    ],
  },
  {
    slug: "vault-retrieval",
    number: "08",
    category: "Retrieval & evaluation",
    title: "Knowing when a search engine got worse",
    cardTitle: "Knowing When a Search Got Worse",
    subtitle:
      "A hybrid search over a note vault, and the held-out set that killed the feature which looked like an improvement.",
    summary:
      "Search across a working knowledge vault, built around a held-out question set rather than around a demo.",
    type: "Individual",
    teamLabel: "Individual",
    status: "Code only",
    context: "A working tool, built for his own notes",
    period: "2026",
    role: "All of it: the retrieval, the fusion, the evaluation set and the decision to throw a feature away.",
    flow: ["Notes", "Chunks", "Dense + keyword", "Fused", "Measured against held-out questions"],
    tools: ["Python", "Chroma", "BM25", "Embeddings"],
    links: [{ label: "GitHub repository", href: "https://github.com/YonoBengkel/agent" }],
    cover: {
      src: agentRetrieval,
      alt: "Diagram: a note vault feeding dense and keyword retrieval, fused by reciprocal rank fusion, then measured against a held-out question set",
      caption:
        "The shape of it. A drawing rather than a screenshot: this one is a command-line tool over a private vault, so there is no interface to photograph.",
    },
    sections: [
      {
        kind: "text",
        heading: "The problem",
        body: [
          "A vault of working notes is only worth keeping if you can find the right note later. Keyword search misses anything phrased differently; embedding search misses exact names, file paths and identifiers, which is most of what a technical note is made of. Running both and merging them is the obvious answer.",
          "The interesting part is not building that. It is knowing whether a change to it made things better or only looked like it did.",
        ],
      },
      {
        kind: "text",
        heading: "The feature that had to go",
        body: [
          "Notes link to each other, so following those links to pull in neighbouring notes should help. It did: on the set of questions used while developing, the scores went up, and the sensible thing would have been to ship it.",
          "On the held-out set they went **down**, and not slightly - the mean reciprocal rank fell from 0.88 to 0.68. So the link expansion was switched off, its weight is still sitting at zero in the code, and the comment next to it says why. That is the whole discipline in one line: a development set tells you what you want to hear, and the only defence is a question set you have not been tuning against.",
        ],
      },
      {
        kind: "decisions",
        heading: "Decisions",
        items: [
          {
            title: "The question set includes questions with no answer",
            body: "If every question in the set has an answer somewhere, a system that always returns something confident scores well. Some questions are about things the vault does not contain, so saying nothing is the right behaviour and can be measured.",
          },
          {
            title: "Two retrievers, fused by rank rather than by score",
            body: "A keyword score and an embedding distance are not on the same scale and averaging them is meaningless. Fusing by position sidesteps that entirely.",
          },
          {
            title: "Re-indexing is incremental, keyed on file contents",
            body: "A vault that takes minutes to re-index is a vault nobody re-indexes. Each file carries a hash, so a run only touches what changed.",
          },
        ],
      },
      {
        kind: "note",
        body: "The vault this runs over is private working notes, so the repository holds the tools and not the content. There are no accuracy figures on this page beyond the one that caused a feature to be deleted, which is the only one that decided anything.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
