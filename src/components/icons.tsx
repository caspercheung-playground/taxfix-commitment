import type { SVGProps } from "react";

export type IconName =
  | "briefcase"
  | "home"
  | "refresh"
  | "percent"
  | "chart"
  | "building"
  | "mail"
  | "monitor"
  | "umbrella"
  | "plus-circle"
  | "check"
  | "chevron-right"
  | "chevron-down"
  | "arrow-right"
  | "arrow-left"
  | "x"
  | "help-circle"
  | "globe"
  | "user"
  | "sparkles"
  | "clock"
  | "upload"
  | "send"
  | "lock"
  | "pencil"
  | "laptop"
  | "wrench"
  | "package"
  | "coins"
  | "car"
  | "phone";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(children: React.ReactNode, { size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  switch (name) {
    case "briefcase":
      return base(
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </>,
        props
      );
    case "home":
      return base(
        <>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </>,
        props
      );
    case "refresh":
      return base(
        <>
          <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 4v4h-4" />
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
          <path d="M3 20v-4h4" />
        </>,
        props
      );
    case "percent":
      return base(
        <>
          <path d="M5 19 19 5" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </>,
        props
      );
    case "chart":
      return base(
        <>
          <path d="M4 20V10" />
          <path d="M12 20V4" />
          <path d="M20 20v-7" />
          <path d="M2 20h20" />
        </>,
        props
      );
    case "building":
      return base(
        <>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
        </>,
        props
      );
    case "mail":
      return base(
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>,
        props
      );
    case "monitor":
      return base(
        <>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </>,
        props
      );
    case "umbrella":
      return base(
        <>
          <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" />
          <path d="M12 12v7a2 2 0 0 1-4 0" />
          <path d="M12 3v1" />
        </>,
        props
      );
    case "plus-circle":
      return base(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </>,
        props
      );
    case "check":
      return base(<path d="M5 13l4 4L19 7" />, props);
    case "chevron-right":
      return base(<path d="m9 6 6 6-6 6" />, props);
    case "chevron-down":
      return base(<path d="m6 9 6 6 6-6" />, props);
    case "arrow-right":
      return base(
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>,
        props
      );
    case "arrow-left":
      return base(
        <>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>,
        props
      );
    case "x":
      return base(
        <>
          <path d="m6 6 12 12M18 6 6 18" />
        </>,
        props
      );
    case "help-circle":
      return base(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.3 1-1.3 1.9" />
          <path d="M12 17h.01" />
        </>,
        props
      );
    case "globe":
      return base(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
        </>,
        props
      );
    case "user":
      return base(
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </>,
        props
      );
    case "lock":
      return base(
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>,
        props
      );
    case "pencil":
      return base(
        <>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </>,
        props
      );
    case "laptop":
      return base(
        <>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M2 20h20" />
        </>,
        props
      );
    case "wrench":
      return base(
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
        props
      );
    case "package":
      return base(
        <>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>,
        props
      );
    case "coins":
      return base(
        <>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14a9 3 0 0 0 18 0V5" />
          <path d="M3 12a9 3 0 0 0 18 0" />
        </>,
        props
      );
    case "sparkles":
      return base(
        <>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </>,
        props
      );
    case "clock":
      return base(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </>,
        props
      );
    case "upload":
      return base(
        <>
          <path d="M12 15V4" />
          <path d="m7 8 5-4 5 4" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </>,
        props
      );
    case "send":
      return base(
        <>
          <path d="M21 3 10 14" />
          <path d="M21 3 14 21l-4-7-7-4Z" />
        </>,
        props
      );
    case "car":
      return base(
        <>
          <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
          <rect x="3" y="13" width="18" height="5" rx="1.5" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
        </>,
        props
      );
    case "phone":
      return base(
        <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.2c1.2.5 2.5.8 3.9.8a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.2a1 1 0 0 1 1 1c0 1.4.3 2.7.8 3.9a1 1 0 0 1-.2 1.1L6.6 10.8Z" />,
        props
      );
  }
}
