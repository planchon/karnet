import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import z from "zod";
import { isImageGeneratingModel, type OpenRouterModel, OpenRouterModelSchema } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { canUseModel } from "@/stores/chat.store";
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

export const useModels = () => {
    const { chatStore } = useStores();

    const {
        data: allModels,
        isLoading,
        error,
    } = useQuery<OpenRouterModel[]>({
        queryKey: ["allModels"],
        queryFn: () => fetch("/api/models").then((res) => res.json()),
        initialData: () => {
            const modelData = localStorage.getItem("all-models");
            if (!modelData) {
                return [];
            }

            const data = JSON.parse(modelData);
            const parsed = z.array(OpenRouterModelSchema).safeParse(data);

            if (!parsed.success) {
                localStorage.removeItem("all-models");
                return [];
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
            allModels
                .filter((model) => {
                    if (isImageGeneratingModel(model) && chatStore.selectedTool.includes("image")) {
                        return true;
                    }

                    if (!(isImageGeneratingModel(model) || chatStore.selectedTool.includes("image"))) {
                        return true;
                    }

                    return false;
                })
                .map((model) => {
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

    return { models, isLoading, error, groupedByProvider, activeGroupedByProvider };
};
