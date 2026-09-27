// Diagrams for the data-warehouse case study. Colours come from CSS variables so they follow dark mode.

const text = { fill: "var(--fg)", fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" };
const box = { fill: "var(--card)", stroke: "var(--line)", strokeWidth: 1.4 };

function Layer({ x, title, color, lines }: { x: number; title: string; color: string; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={46} width={94} height={104} rx={8} fill="var(--bg)" stroke={color} strokeWidth={1.8} />
      <text x={x + 47} y={67} textAnchor="middle" fontSize={12} fontWeight={700} fill={color} fontFamily={text.fontFamily}>
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
    <svg viewBox="0 0 600 205" className="h-auto w-full" role="img" aria-label="Pipeline from CRM and ERP sources through raw, clean, and star-schema layers into data marts">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--brand)" />
        </marker>
      </defs>
      <rect x={2} y={14} width={118} height={78} rx={7} {...box} />
      <text x={12} y={33} fontSize={12} fontWeight={700} fill="var(--brand)" fontFamily={text.fontFamily}>CRM</text>
      {["customers", "products", "sales lines"].map((l, i) => (
        <text key={l} x={12} y={51 + i * 15} fontSize={10.5} {...text}>{l}</text>
      ))}
      <rect x={2} y={104} width={118} height={78} rx={7} {...box} />
      <text x={12} y={123} fontSize={12} fontWeight={700} fill="var(--brand)" fontFamily={text.fontFamily}>ERP</text>
      {["customer details", "locations", "product categories"].map((l, i) => (
        <text key={l} x={12} y={141 + i * 15} fontSize={10.5} {...text}>{l}</text>
      ))}
      <path d="M121,53 L150,90" stroke="var(--brand)" strokeWidth={1.4} fill="none" markerEnd="url(#arrow)" />
      <path d="M121,143 L150,106" stroke="var(--brand)" strokeWidth={1.4} fill="none" markerEnd="url(#arrow)" />
      <Layer x={153} title="Raw" color="#a26d2d" lines={["as-is copy", "+ where and", "when it arrived"]} />
      <path d="M248,98 L262,98" stroke="var(--brand)" strokeWidth={1.4} markerEnd="url(#arrow)" />
      <Layer x={266} title="Clean" color="#7b8594" lines={["IDs matched", "codes unified", "dates repaired"]} />
      <path d="M361,98 L375,98" stroke="var(--brand)" strokeWidth={1.4} markerEnd="url(#arrow)" />
      <Layer x={379} title="Star schema" color="#a8801a" lines={["customer, product,", "date dimensions", "+ sales facts"]} />
      <path d="M474,98 L488,98" stroke="var(--brand)" strokeWidth={1.4} markerEnd="url(#arrow)" />
      <rect x={492} y={34} width={106} height={128} rx={8} fill="var(--brand-solid)" />
      <text x={545} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff" fontFamily={text.fontFamily}>Data marts</text>
      {["profitability", "customers", "sales trends", "top spenders"].map((l, i) => (
        <text key={l} x={545} y={78 + i * 18} textAnchor="middle" fontSize={10} fill="#dfe6f3" fontFamily={text.fontFamily}>{l}</text>
      ))}
      <path d="M153,172 L153,180 L598,180 L598,172" stroke="var(--muted)" strokeWidth={1.2} fill="none" />
      <text x={375} y={198} textAnchor="middle" fontSize={10.5} fill="var(--muted)" fontFamily={text.fontFamily}>
        runs automatically every day, in order
      </text>
    </svg>
  );
}

export function StarSchemaDiagram() {
  return (
    <svg viewBox="0 0 300 215" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Star schema: sales facts linked to customer, product, and date dimensions">
      <line x1={150} y1={108} x2={62} y2={40} stroke="var(--muted)" strokeWidth={1.4} />
      <line x1={150} y1={108} x2={238} y2={40} stroke="var(--muted)" strokeWidth={1.4} />
      <line x1={150} y1={108} x2={150} y2={178} stroke="var(--muted)" strokeWidth={1.4} />
      <rect x={2} y={4} width={120} height={66} rx={7} {...box} />
      <text x={12} y={22} fontSize={11} fontWeight={700} fill="var(--brand)" fontFamily={text.fontFamily}>Customer</text>
      <text x={12} y={39} fontSize={9.5} {...text}>gender, marital status,</text>
      <text x={12} y={53} fontSize={9.5} {...text}>birth date, country</text>
      <rect x={178} y={4} width={120} height={66} rx={7} {...box} />
      <text x={188} y={22} fontSize={11} fontWeight={700} fill="var(--brand)" fontFamily={text.fontFamily}>Product</text>
      <text x={188} y={39} fontSize={9.5} {...text}>category, cost; one row</text>
      <text x={188} y={53} fontSize={9.5} {...text}>per price version</text>
      <rect x={90} y={84} width={120} height={50} rx={7} fill="var(--brand-solid)" />
      <text x={150} y={104} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff" fontFamily={text.fontFamily}>Sales facts</text>
      <text x={150} y={121} textAnchor="middle" fontSize={9.5} fill="#dfe6f3" fontFamily={text.fontFamily}>qty · price · sales · profit</text>
      <rect x={90} y={160} width={120} height={50} rx={7} {...box} />
      <text x={150} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--brand)" fontFamily={text.fontFamily}>Date</text>
      <text x={150} y={197} textAnchor="middle" fontSize={9.5} {...text}>day · month · quarter · year</text>
    </svg>
  );
}
