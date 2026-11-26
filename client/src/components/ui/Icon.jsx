function Icon({ name }) {
  const paths = {
    book: (
      <>
        <path d="M4 5.5c3-1 5.6-.4 8 1.5v12c-2.4-1.9-5-2.5-8-1.5v-12Z" />
        <path d="M20 5.5c-3-1-5.6-.4-8 1.5v12c2.4-1.9 5-2.5 8-1.5v-12Z" />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6M10 3v5l-5 9a2.7 2.7 0 0 0 2.4 4h9.2a2.7 2.7 0 0 0 2.4-4l-5-9V3" />
        <path d="M7.5 15h9" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.3a1.8 1.8 0 0 0 .5-3.5 1.8 1.8 0 0 1 .5-3.5H17a4 4 0 0 0 4-4c0-3.9-4-7-9-7Z" />
        <path d="M7.5 10h.01M10 6.8h.01M14 6.5h.01M17.2 9h.01" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12S9.6 18.5 12 21" />
      </>
    ),
    light: (
      <>
        <path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.7-1.5 1.8-1.5 2.5h-4c0-.7-.6-1.8-1.5-2.5Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4ZM12 12v5M8 21h8M9 17h6" />
        <path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4" />
      </>
    ),
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {paths[name]}
    </svg>
  );
}

export default Icon;


