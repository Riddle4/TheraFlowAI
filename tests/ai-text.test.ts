import { describe, expect, it } from "vitest";
import { cleanAiText } from "@/lib/aiText";

describe("nettoyage des sorties IA", () => {
  it("retire les marqueurs Markdown décoratifs", () => {
    const cleaned = cleanAiText("### **Résumé**\n\n---\n\n**Point clé**: utile");

    expect(cleaned).toBe("Résumé\n\nPoint clé: utile");
  });
});
