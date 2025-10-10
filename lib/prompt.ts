// @ts-expect-error
import basePrompt from "./base_prompt.md";

export const generatePrompt = (model: string, date: string, gps: string) =>
    basePrompt.replace("{{model}}", model).replace("{{date}}", date).replace("{{gps}}", gps);
