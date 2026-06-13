type DocumentContentOp = {
  insert?: unknown;
};

export function getDocumentName(
  title?: string,
  content?: DocumentContentOp[]
) {
  if (title) {
    return title;
  }

  const text =
    content
      ?.map((op) => (typeof op.insert === "string" ? op.insert : ""))
      .join("")
      .slice(0, 20) || "";

  return text + (text.length >= 20 ? "..." : "Untitled Document");
}
