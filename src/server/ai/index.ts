import { env } from "@/env";
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const openaiModel = openai("gpt-4o");

export const openaiEmbeddingsModel = openai.embedding("text-embedding-ada-002");
