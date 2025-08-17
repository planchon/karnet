import { AgentModel } from "@/models/agent.model";

export const titleAgent = new AgentModel({
  id: 'title-agent',
  description: 'Generate a great title from a markdown content',
  prompt: `
  You are a title generator.
  You are given a markdown content and you need to generate a great title for it.
  The title should be a single sentence that captures the main idea of the content.
  The title should be no more than 10 words.
  `,
  code: `
// title: title agent
// description: this code is used to generate a title from a markdown content
// author: @p6n
// date: 2025-08-16
// version: 1.0.0 

export const agent = (context: KarnetContext) => {
  const { prompt, model } = context;

  const schema = z.object({
    title: z.string().describe('The title of the content'),
  })

  const result = await karnet.model(model)
    .prompt(prompt)
    .schema(schema)
    .run()

  return result.data;
}
  `,
})