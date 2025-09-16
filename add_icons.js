const fs = require("fs");

// Read the models.ts file
const filePath = "/Users/paul/Karnet/app/karnet/ai/models.ts";
let content = fs.readFileSync(filePath, "utf8");

// Provider to icon mapping
const providerIconMap = {
	alibaba: "<Alibaba />",
	anthropic: "<Anthropic />",
	azure: "<Azure />",
	baseten: "<Baseten />",
	bedrock: "<Bedrock />",
	chutes: "<Chutes />",
	cohere: "<Cohere />",
	deepinfra: "<DeepInfra />",
	deepseek: "<DeepSeek />",
	fireworks: "<Fireworks />",
	google: "<Google />",
	groq: "<Groq />",
	inception: "<Inception />",
	mistral: "<Mistral />",
	moonshotai: "<MoonshotAI />",
	morph: "<Morph />",
	novita: "<Novita />",
	openai: "<OpenAI />",
	parasail: "<Parasail />",
	perplexity: "<Perplexity />",
	stealth: "<Stealth />",
	vercel: "<Vercel />",
	vertex: "<Vertex />",
	voyage: "<Voyage />",
	xai: "<XAI />",
	zai: "<ZAI />",
};

// Find all modelType: "language" or modelType: "embedding" lines and add icon after them
content = content.replace(
	/(\s+modelType: "(?:language|embedding)",)/g,
	(match, modelTypeLine) => {
		// Find the provider in the previous lines
		const lines = content.substring(0, content.indexOf(match)).split("\n");
		let provider = null;

		// Look backwards for the provider line
		for (let i = lines.length - 1; i >= 0; i--) {
			const line = lines[i];
			const providerMatch = line.match(/provider:\s*"([^"]+)"/);
			if (providerMatch) {
				provider = providerMatch[1];
				break;
			}
		}

		if (provider && providerIconMap[provider]) {
			return modelTypeLine + "\n\t\ticon: " + providerIconMap[provider] + ",";
		}

		return modelTypeLine;
	},
);

// Write the updated content back
fs.writeFileSync(filePath, content);
console.log("Icons added successfully!");
