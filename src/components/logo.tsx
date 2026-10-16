/**
 * The mark: a flowchart decision diamond cut open by a vertical slot of light.
 * The diamond is the point where a business decides; the slot is an absence, and
 * it reads as an I.
 *
 * Two cuts, and they are not interchangeable. `small` widens the slot and pulls
 * the diamond in so both survive the pixel grid at 24px and below; the default is
 * the reversed cut, thinned against the bloom light-on-dark produces. The display
 * cut (dark on light) lives in the kit, not here, because this site has no light
 * page. Full rules: D:\KULIAH\IDENTITAS\Logo\GUIDELINES.md.
 *
 * It inherits colour, so it is bone wherever the text is bone and brass on hover.
 */
export function Logo({ size = 20, small = false, className }: { size?: number; small?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        d={
          small
            ? "M 128 30 L 226 128 L 128 226 L 30 128 Z M 108 70 L 148 70 L 148 186 L 108 186 Z"
            : "M 128 26 L 230 128 L 128 230 L 26 128 Z M 110 63 L 146 63 L 146 187 L 110 187 Z"
        }
      />
    </svg>
  );
}
