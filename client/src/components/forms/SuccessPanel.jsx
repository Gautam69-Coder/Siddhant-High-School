import Arrow from "../ui/Arrow";

function SuccessPanel({ title, message, resetLabel, onReset, note }) {
  return (
    <div className="form-success" role="status" aria-live="polite">
      <span className="success-mark">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <p className="eyebrow">Submission received</p>
      <h3>{title}</h3>
      <p>{message}</p>
      {note && <p className="success-note">{note}</p>}
      <button className="button primary" type="button" onClick={onReset}>
        {resetLabel} <Arrow />
      </button>
    </div>
  );
}



export default SuccessPanel;
