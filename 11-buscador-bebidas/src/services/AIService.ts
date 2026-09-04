import { streamText } from "ai";
import { openrouter } from "../lib/ai";
export default {
  async generateRecipe(prompt: string) {
    const result = streamText({
      model: openrouter("inclusionai/ling-3.0-flash-fin:free"),
      prompt,
    });
    return result.textStream;
  },
};
