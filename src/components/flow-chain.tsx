/**
 * The project read left to right in four to six steps. It is a diagram made of
 * words, so it survives a 375px screen and a failed image, and it answers the
 * first question a reader has: what actually happens here.
 */
export function FlowChain({ steps }: { steps: string[] }) {
  return (
    <ol className="flow" aria-label="How it flows">
      {steps.map((step, i) => (
        <li key={step} className="flow-step">
          {i > 0 && <span className="flow-mark" aria-hidden="true" />}
          <span className="flow-label">{step}</span>
        </li>
      ))}
    </ol>
  );
}
