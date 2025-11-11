export default function capitalizeWords(text) {
  if (!text) return "";

  return text
    .toString()
    .replace(/[_-]+/g, " ") // replace underscores or hyphens with spaces
    .split(" ") // split into words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // capitalize first letter
    )
    .join(" "); // join back into a sentence
}
