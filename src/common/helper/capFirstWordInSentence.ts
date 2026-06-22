export default function capFirstWordInSentence(text: string) {
  return text
    .trim()
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, function (_matched, separator, letter) {
      return separator + letter.toUpperCase();
    });
}
