export const generateId = (prefix = "TAG", length = 8) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Array.from({ length }, () =>
    Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase()
  ).join("");

  return `${prefix}-${timestamp}-${randomPart}`;
};

console.log(generateId());
