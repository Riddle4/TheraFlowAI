import "server-only";

const OPENAI_URL = "https://api.openai.com/v1/responses";

type ResponsesApiResult = {
  model?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function extractResponseText(data: ResponsesApiResult): string | null {
  if (data.output_text) return data.output_text;

  const textParts = data.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text);

  return textParts?.length ? textParts.join("\n") : null;
}

export async function callOpenAI({
  system,
  user
}: {
  system: string;
  user: string;
}): Promise<{ content: string; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-5.5";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY est manquant");
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions: system,
      input: user,
      store: false,
      reasoning: { effort: "medium" },
      text: { verbosity: "medium" }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Erreur OpenAI ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await response.json()) as ResponsesApiResult;
  const content = extractResponseText(data);
  if (!content) throw new Error("Réponse OpenAI vide");

  return { content, model: data.model ?? model };
}
