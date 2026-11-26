import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const defaultTickerItems = [
  { id: "office-hours", label: "Office Hours: 8:00 AM – 2:00 PM", to: null },
  { id: "admissions-open", label: "Admissions Open for Academic Session 2027–28", to: "/admissions" },
  { id: "apply", label: "Apply for Admission", to: "/admissions?form=application" },
  { id: "contact", label: "Contact Us", to: "/contact" },
];

function TickerItem({ item, onNavigate, duplicate = false }) {
  const content = <>{item.label}<span className="school-ticker-separator" aria-hidden="true" /></>;

  if (!item.to) {
    return <span className="school-ticker-item">{content}</span>;
  }

  return (
    <a
      className="school-ticker-item school-ticker-link"
      href={item.to}
      tabIndex={duplicate ? -1 : undefined}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.currentTarget.target === "_blank"
        ) {
          return;
        }
        event.preventDefault();
        onNavigate(item.to);
      }}
    >
      {content}
    </a>
  );
}

function TickerGroup({ items, onNavigate, duplicate = false, groupRef }) {
  return (
    <div className="school-ticker-group" ref={groupRef} aria-hidden={duplicate || undefined}>
      {items.map((item) => (
        <TickerItem key={item.id} item={item} onNavigate={onNavigate} duplicate={duplicate} />
      ))}
    </div>
  );
}

export default function NewsTicker({ onNavigate, announcements = [], schoolSettings }) {
  const prefersReducedMotion = useReducedMotion();
  const windowRef = useRef(null);
  const groupRef = useRef(null);
  const animationRef = useRef(null);
  const x = useMotionValue(0);
  const [loopConfig, setLoopConfig] = useState({ distance: 0, copies: 2 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  const baseTickerItems = [
    {
      id: "office-hours",
      label: `Office Hours: ${schoolSettings?.office_hours || "8:00 AM – 2:00 PM"}`,
      to: null,
    },
    {
      id: "admissions-open",
      label: `Admissions Open for Academic Session ${schoolSettings?.academic_year || "2026–27"}`,
      to: "/admissions",
    },
    ...defaultTickerItems.slice(2),
  ];

  const items = announcements.length > 0
    ? [
        ...announcements.slice(0, 3).map((item) => ({
          id: `announcement-${item.id}`,
          label: `${item.is_urgent ? "⚡ Notice: " : "📢 "}${item.title}`,
          to: "/news",
        })),
        ...baseTickerItems,
      ]
    : baseTickerItems;

  useEffect(() => {
    const tickerWindow = windowRef.current;
    const firstGroup = groupRef.current;
    if (!tickerWindow || !firstGroup || prefersReducedMotion) return undefined;

    const measure = () => {
      const groupWidth = firstGroup.getBoundingClientRect().width;
      if (!groupWidth) return;
      const copies = Math.max(2, Math.ceil(tickerWindow.clientWidth / groupWidth) + 1);
      setLoopConfig((current) => (
        current.distance === groupWidth && current.copies === copies
          ? current
          : { distance: groupWidth, copies }
      ));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tickerWindow);
    observer.observe(firstGroup);
    return () => observer.disconnect();
  }, [prefersReducedMotion, items]);

  useEffect(() => {
    animationRef.current?.stop();
    if (prefersReducedMotion || paused || loopConfig.distance <= 0) return undefined;

    const start = x.get();
    animationRef.current = animate(x, start - loopConfig.distance, {
      duration: Math.max(28, loopConfig.distance / 34),
      ease: "linear",
      repeat: Infinity,
    });
    return () => animationRef.current?.stop();
  }, [loopConfig.distance, paused, prefersReducedMotion, x]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <div
      className={`school-information-ticker${prefersReducedMotion ? " is-static" : ""}`}
      role="region"
      aria-label="School information ticker"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
    >
      <div className={`school-ticker-window${prefersReducedMotion ? " is-static" : ""}`} ref={windowRef}>
        {prefersReducedMotion ? (
          <TickerGroup items={items} onNavigate={onNavigate} />
        ) : (
          <motion.div className="school-ticker-track" style={{ x }}>
            {Array.from({ length: loopConfig.copies }, (_, index) => (
              <TickerGroup
                key={index}
                items={items}
                onNavigate={onNavigate}
                duplicate={index > 0}
                groupRef={index === 0 ? groupRef : undefined}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
