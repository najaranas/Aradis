/**
 * Generates a unique identifier string composed of a prefix, a timestamp, and a random alphanumeric part.
 *
 * @function
 * @param {string} [prefix="TAG"] - The prefix for the generated ID. Defaults to "TAG" if not provided.
 * @param {number} [length=8] - The length of the random alphanumeric part of the ID. Defaults to 8 if not provided.
 * @returns {string} The generated ID in the format "prefix-timestamp-randomPart".
 */
export const generateId = (prefix = "TAG", length = 8) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Array.from({ length }, () =>
    Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase()
  ).join("");

  return `${prefix}-${timestamp}-${randomPart}`;
};
