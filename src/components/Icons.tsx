import type { CategoryIcon as CategoryIconName } from "@/lib/markets";

type IconProps = { size?: number; className?: string };

export function LogoMark({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="7" fill="var(--blue)" />
      <polyline
        points="6,19 11,13 15,16 22,8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="2" fill="#fff" />
    </svg>
  );
}

const categoryBg: Record<CategoryIconName, string> = {
  politics: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
  weather: "linear-gradient(135deg,#f97316,#facc15)",
  economy: "linear-gradient(135deg,#047857,#34d399)",
  people: "linear-gradient(135deg,#7c3aed,#f472b6)",
};

export function CategoryIcon({ name, size = 64 }: { name: CategoryIconName; size?: number }) {
  return (
    <span
      className="category-icon"
      style={{ width: size, height: size, background: categoryBg[name] }}
      aria-hidden="true"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {name === "politics" && (
          <>
            <path d="M3 21h18" />
            <path d="M5 21V10M9.5 21V10M14.5 21V10M19 21V10" />
            <path d="M2 10h20L12 3 2 10z" />
          </>
        )}
        {name === "weather" && (
          <>
            <circle cx="9" cy="9" r="3.5" />
            <path d="M9 2v1.5M2 9h1.5M4 4l1 1M14 4l-1 1" />
            <path d="M8 20h10a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6 1.6A2.8 2.8 0 0 0 8 20z" />
          </>
        )}
        {name === "economy" && (
          <>
            <path d="M3 4h2l2.4 11h10.8L21 7H6.3" />
            <circle cx="9" cy="19.5" r="1.5" />
            <circle cx="17" cy="19.5" r="1.5" />
          </>
        )}
        {name === "people" && (
          <>
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2.4" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M15 14.3c.6-.2 1.3-.3 2-.3 2.8 0 5 2.2 5 5" />
          </>
        )}
      </svg>
    </span>
  );
}

function Stroke({ size = 18, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Stroke>
);

export const BookmarkIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Stroke {...p}>
    <path d="M6 3h12v18l-6-4-6 4z" fill={filled ? "currentColor" : "none"} />
  </Stroke>
);

export const ShareIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Stroke>
);

export const ChevronIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m9 6 6 6-6 6" />
  </Stroke>
);

export const ExternalIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Stroke>
);

export const ClockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Stroke>
);
