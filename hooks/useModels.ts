import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import z from "zod";
import { type OpenRouterModel, OpenRouterModelSchema } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const userActiveModelsSchema = z.array(
    z.object({
        _id: z.string().transform((val) => val as Id<"models">),
        _creationTime: z.number(),
        subject: z.string(),
        model_id: z.string(),
        name: z.string(),
        provider: z.string(),
        features: z.array(z.string()),
    })
);

export type UserActiveModel = z.infer<typeof userActiveModelsSchema>;

export type KarnetModel = ReturnType<typeof useModels>["models"][number];

export const useModels = () => {
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
            allModels?.map((model) => {
                const userActiveModel = userActiveModels?.find((activeModel) => activeModel.model_id === model.id);
                if (userActiveModel) {
                    return { ...model, active: true as const, active_id: userActiveModel._id };
                }
                return { ...model, active: false as const };
            }),
        [allModels, userActiveModels]
    );

    return { models, isLoading, error };
};
