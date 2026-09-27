// Diagrams for the data-warehouse case study. All colours come from --dg-* variables
// (see globals.css), so the same drawing works on the page, in dark mode, and on the gold tile.
// Layers are told apart by line style, not colour: raw is dashed, clean is solid, the star schema
// has a double outline, and the data marts are filled.

const font = "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif";
const text = { fill: "var(--dg-ink)", fontFamily: font };
const box = { fill: "var(--dg-box)", stroke: "var(--dg-line)", strokeWidth: 1.4 };

type LayerStyle = "dashed" | "solid" | "double";

function Layer({ x, title, lines, line }: { x: number; title: string; lines: string[]; line: LayerStyle }) {
  return (
    <g>
      {line === "double" && (
        <rect x={x - 3.5} y={42.5} width={101} height={111} rx={10} fill="none" stroke="var(--dg-ink)" strokeWidth={1.2} />
      )}
      <rect
        x={x}
        y={46}
        width={94}
        height={104}
        rx={7}
        fill="var(--dg-box)"
        stroke="var(--dg-ink)"
        strokeWidth={1.6}
        strokeDasharray={line === "dashed" ? "5 4" : undefined}
      />
      <text x={x + 47} y={67} textAnchor="middle" fontSize={12} fontWeight={800} {...text}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 47} y={88 + i * 15} textAnchor="middle" fontSize={10} {...text}>
          {l}
        </text>
      ))}
    </g>
  );
}

export function PipelineDiagram() {
  return (
    <svg
      viewBox="0 0 600 205"
      className="diagram h-auto w-full"
      role="img"
      aria-label="Pipeline from CRM and ERP sources through raw, clean, and star-schema layers into data marts"
    >
      <defs>
        <marker id="pipeline-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--dg-ink)" />
        </marker>
      </defs>
      <rect x={2} y={14} width={118} height={78} rx={7} {...box} />
      <text x={12} y={33} fontSize={12} fontWeight={800} {...text}>
        CRM
      </text>
      {["customers", "products", "sales lines"].map((l, i) => (
        <text key={l} x={12} y={51 + i * 15} fontSize={10.5} {...text}>
          {l}
        </text>
      ))}
      <rect x={2} y={104} width={118} height={78} rx={7} {...box} />
      <text x={12} y={123} fontSize={12} fontWeight={800} {...text}>
        ERP
      </text>
      {["customer details", "locations", "product categories"].map((l, i) => (
        <text key={l} x={12} y={141 + i * 15} fontSize={10.5} {...text}>
          {l}
        </text>
      ))}
      <path d="M121,53 L150,90" stroke="var(--dg-ink)" strokeWidth={1.4} fill="none" markerEnd="url(#pipeline-arrow)" />
      <path d="M121,143 L150,106" stroke="var(--dg-ink)" strokeWidth={1.4} fill="none" markerEnd="url(#pipeline-arrow)" />
      <Layer x={156} title="Raw" line="dashed" lines={["as-is copy", "+ where and", "when it arrived"]} />
      <path d="M251,98 L263,98" stroke="var(--dg-ink)" strokeWidth={1.4} markerEnd="url(#pipeline-arrow)" />
      <Layer x={267} title="Clean" line="solid" lines={["IDs matched", "codes unified", "dates repaired"]} />
      <path d="M362,98 L374,98" stroke="var(--dg-ink)" strokeWidth={1.4} markerEnd="url(#pipeline-arrow)" />
      <Layer x={381} title="Star schema" line="double" lines={["customer, product,", "date dimensions", "+ sales facts"]} />
      <path d="M479,98 L489,98" stroke="var(--dg-ink)" strokeWidth={1.4} markerEnd="url(#pipeline-arrow)" />
      <rect x={492} y={34} width={106} height={128} rx={8} fill="var(--dg-solid)" />
      <text x={545} y={55} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--dg-on-solid)" fontFamily={font}>
        Data marts
      </text>
      {["profitability", "customers", "sales trends", "top spenders"].map((l, i) => (
        <text key={l} x={545} y={78 + i * 18} textAnchor="middle" fontSize={10} fill="var(--dg-on-solid)" fontFamily={font}>
          {l}
        </text>
      ))}
      <path d="M153,172 L153,180 L598,180 L598,172" stroke="var(--dg-muted)" strokeWidth={1.2} fill="none" />
      <text x={375} y={198} textAnchor="middle" fontSize={10.5} fill="var(--dg-muted)" fontFamily={font}>
        runs automatically every day, in order
      </text>
    </svg>
  );
}

export function StarSchemaDiagram() {
  return (
    <svg
      viewBox="0 0 300 215"
      className="diagram mx-auto h-auto w-full max-w-md"
      role="img"
      aria-label="Star schema: sales facts linked to customer, product, and date dimensions"
    >
      <line x1={150} y1={108} x2={62} y2={40} stroke="var(--dg-muted)" strokeWidth={1.4} />
      <line x1={150} y1={108} x2={238} y2={40} stroke="var(--dg-muted)" strokeWidth={1.4} />
      <line x1={150} y1={108} x2={150} y2={178} stroke="var(--dg-muted)" strokeWidth={1.4} />
      <rect x={2} y={4} width={120} height={66} rx={7} {...box} />
      <text x={12} y={22} fontSize={11} fontWeight={800} {...text}>
        Customer
      </text>
      <text x={12} y={39} fontSize={9.5} {...text}>
        gender, marital status,
      </text>
      <text x={12} y={53} fontSize={9.5} {...text}>
        birth date, country
      </text>
      <rect x={178} y={4} width={120} height={66} rx={7} {...box} />
      <text x={188} y={22} fontSize={11} fontWeight={800} {...text}>
        Product
      </text>
      <text x={188} y={39} fontSize={9.5} {...text}>
        category, cost; one row
      </text>
      <text x={188} y={53} fontSize={9.5} {...text}>
        per price version
      </text>
      <rect x={90} y={84} width={120} height={50} rx={7} fill="var(--dg-solid)" />
      <text x={150} y={104} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--dg-on-solid)" fontFamily={font}>
        Sales facts
      </text>
      <text x={150} y={121} textAnchor="middle" fontSize={9.5} fill="var(--dg-on-solid)" fontFamily={font}>
        qty, price, sales, profit
      </text>
      <rect x={90} y={160} width={120} height={50} rx={7} {...box} />
      <text x={150} y={180} textAnchor="middle" fontSize={11} fontWeight={800} {...text}>
        Date
      </text>
      <text x={150} y={197} textAnchor="middle" fontSize={9.5} {...text}>
        day, month, quarter, year
      </text>
    </svg>
  );
}
