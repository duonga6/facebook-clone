function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function deepCopy(src) {
  if (src === null || typeof src !== "object") {
    return src;
  }

  const target = Array.isArray(src) ? [] : {};

  for (const key in src) {
    if (typeof src[key] === "function") {
      target[key] = src[key];
    } else {
      target[key] = deepCopy(src[key]);
    }
  }

  return target;
}

export { generateUUID, deepCopy };
