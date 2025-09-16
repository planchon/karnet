import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { useEffect, useState } from "react";

export const useModels = () => {
	const [models, setModels] = useState<GatewayLanguageModelEntry[]>([]);

	useEffect(() => {
		fetch("/api/models")
			.then((res) => res.json())
			.then((models) => {
				setModels(models);
			});
	}, []);

	return models;
};
