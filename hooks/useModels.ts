import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import z from "zod";
import { OpenRouterModelSchema } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useStores } from "./useStores";

const userActiveModelsSchema = z.array(
    z.object({
        _id: z.string().transform((val) => val as Id<"models">),
        _creationTime: z.number(),
        subject: z.string(),
        model_id: z.string(),
        name: z.string(),
        provider: z.string(),
        features: z.array(z.string()),
        default: z.boolean().optional(),
    })
);

export type UserActiveModel = z.infer<typeof userActiveModelsSchema>;

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
        data: { models: allModels, defaultTextModel, defaultImageModel },
        isLoading,
        error,
    } = useQuery<ModelsData>({
        queryKey: ["allModels"],
        queryFn: () => fetch("/api/models").then((res) => res.json()),
        initialData: () => {
            const modelData = localStorage.getItem("models");
            if (!modelData) {
                return {
                    models: [],
                    defaultTextModel: null,
                    defaultImageModel: null,
                };
            }

            const data = JSON.parse(modelData);
            const parsed = schema.safeParse(data);

            if (!parsed.success) {
                localStorage.removeItem("models");
                return {
                    models: [],
                    defaultTextModel: null,
                    defaultImageModel: null,
                };
            }

            return parsed.data;
        },
    });

    const { data: userActiveModels } = useQuery({
        ...convexQuery(api.functions.models.getModels, {}),
        initialData: () => {
            const userActiveModelsData = localStorage.getItem("user-active-models");
            if (!userActiveModelsData) {
                return [];
            }
            const parsed = userActiveModelsSchema.safeParse(JSON.parse(userActiveModelsData));
            if (!parsed.success) {
                localStorage.removeItem("user-active-models");
                return [];
            }
            return parsed.data;
        },
    });

    useEffect(() => {
        if (userActiveModels) {
            localStorage.setItem("user-active-models", JSON.stringify(userActiveModels));
        }
    }, [userActiveModels]);

    useEffect(() => {
        if (allModels) {
            localStorage.setItem("all-models", JSON.stringify(allModels));
        }
    }, [allModels]);

    const models = useMemo(
        () =>
            allModels.map((model) => {
                const userActiveModel = userActiveModels?.find((activeModel) => activeModel.model_id === model.id);
                if (userActiveModel) {
                    return {
                        ...model,
                        active: true as const,
                        active_id: userActiveModel._id,
                        default: userActiveModel.default,
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

    chatStore.setDefaultModels(defaultTextModel as KarnetModel, defaultImageModel as KarnetModel);

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
