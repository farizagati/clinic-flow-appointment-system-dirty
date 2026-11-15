/**
 * FieldError — Reusable inline field validation error.
 *
 * Props:
 *   message  {string}  The error message to display. Renders nothing if falsy.
 *   fieldId  {string}  The id of the associated input. Kept for parity with
 *                      version A; it no longer renders a test hook.
 */
export function FieldError({ message, fieldId }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="field-error-msg"
    >
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontSize: '14px', verticalAlign: 'middle' }}
      >
        error
      </span>
      {message}
    </p>
  );
}
