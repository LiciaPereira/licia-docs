import { describe, expect, it } from "vitest";
import { getDocumentName } from "./document-name";

describe("getDocumentName", () => {
  it("uses the document title when present", () => {
    expect(getDocumentName("Project notes", [])).toBe("Project notes");
  });

  it("creates a short fallback from document content", () => {
    expect(
      getDocumentName(undefined, [
        { insert: "Collaborative editing draft" },
        { insert: { image: "ignored" } },
      ])
    ).toBe("Collaborative editin...");
  });

  it("uses an untitled fallback when no title or text exists", () => {
    expect(getDocumentName(undefined, [])).toBe("Untitled Document");
  });
});
