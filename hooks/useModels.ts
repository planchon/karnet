import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import z from "zod";
import { OpenRouterModelSchema } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import { useStores } from "./useStores";

export type KarnetModel = ReturnType<typeof useModels>["models"][number];

const schema = z.object({
    models: z.array(OpenRouterModelSchema),
    defaultTextModel: OpenRouterModelSchema.nullish(),
    defaultImageModel: OpenRouterModelSchema.nullish(),
});

export type ModelsData = z.infer<typeof schema>;

export const useModels = () => {
    const { chatStore } = useStores();

    const {
        data: { models: allModels, defaultTextModel, defaultImageModel } = {
            models: [],
            defaultTextModel: null,
            defaultImageModel: null,
        },
        isLoading,
        error,
    } = useQuery<ModelsData>({
        queryKey: ["allModels"],
        queryFn: () => fetch("/api/models").then((res) => res.json()),
    });

    const { data: userActiveModels = [] } = useQuery({
        ...convexQuery(api.functions.models.getModels, {}),
    });

    console.log("userActiveModels", userActiveModels);

    const models = useMemo(
        () =>
            allModels.map((model) => {
                const userActiveModel = userActiveModels.find((activeModel) => activeModel.model_id === model.id);

                if (userActiveModel && "_id" in userActiveModel) {
                    return {
                        ...model,
                        active: true as const,
                        active_id: userActiveModel._id,
                        default: "default" in userActiveModel ? userActiveModel.default : false,
                    };
                }
                return { ...model, active: false as const, default: false };
            }),
        [allModels, userActiveModels, chatStore.selectedTool]
    );

    const textModels = useMemo(
        () => models.filter((model) => model.architecture.output_modalities.includes("text")),
        [models]
    );
    const imageModels = useMemo(
        () => models.filter((model) => model.architecture.output_modalities.includes("image")),
        [models]
    );

    const groupedByProvider = models.reduce(
        (acc, model) => {
            acc[model.provider] = acc[model.provider] || [];
            acc[model.provider].push(model);
            return acc;
        },
        {} as Record<string, (typeof models)[number][]>
    );

    const activeGroupedByProvider = models
        .filter((model) => model.active)
        .reduce(
            (acc, model) => {
                acc[model.provider] = acc[model.provider] || [];
                acc[model.provider].push(model);
                return acc;
            },
            {} as Record<string, (typeof models)[number][]>
        );

    // Use user's selected default models from database, fallback to API defaults
    const userDefaultTextModel = models.find(
        (model) => model.default && !model.architecture.output_modalities.includes("image")
    );
    const userDefaultImageModel = models.find(
        (model) => model.default && model.architecture.output_modalities.includes("image")
    );

    chatStore.setDefaultModels(
        (userDefaultTextModel || defaultTextModel) as KarnetModel,
        (userDefaultImageModel || defaultImageModel) as KarnetModel
    );

    return {
        models,
        textModels,
        imageModels,
        defaultTextModel,
        defaultImageModel,
        isLoading,
        error,
        groupedByProvider,
        activeGroupedByProvider,
    };
};
