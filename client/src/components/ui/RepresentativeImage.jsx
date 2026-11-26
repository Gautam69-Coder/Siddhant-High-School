import { useState } from "react";

function RepresentativeImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={`${alt} Image unavailable`}>
        <span>Representative image unavailable</span>
      </div>
    );
  }
  return (
    <img
      className={`representative-image ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default RepresentativeImage;


