function FieldError({ name, errors, touched }) {
  const error = touched[name] && errors[name];
  return error ? (
    <span className="field-error" id={`${name}-error`} role="alert">
      {error}
    </span>
  ) : null;
}



export default FieldError;
