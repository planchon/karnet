import { convexQuery, useConvex } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import type { FunctionArgs, FunctionReference, FunctionReturnType, OptionalRestArgs } from "convex/server";
import { useEffect, useState } from "react";

type UseSyncProps<
    ConvexQueryReference extends FunctionReference<"query">,
    Args extends FunctionArgs<ConvexQueryReference> | "skip",
> = {
    args: Args;
    queryFn: ConvexQueryReference;
    key: (args: Args) => string;
    options?: {
        isLocallyStored?: boolean;
        debounceTime?: number;
    };
};

export const useSync = <
    ConvexQueryReference extends FunctionReference<"query">,
    Args extends FunctionArgs<ConvexQueryReference> | "skip",
>({
    args,
    queryFn,
    key,
    options,
}: UseSyncProps<ConvexQueryReference, Args>) =>
    useQuery({
        ...convexQuery(queryFn, args),
        initialData: () => {
            if (options?.isLocallyStored) {
                const rawData = localStorage.getItem(key(args));
                if (rawData) {
                    return JSON.parse(rawData);
                }
            }
        },
    });

export const useSyncOnce = <
    ConvexQueryReference extends FunctionReference<"query">,
    Args extends OptionalRestArgs<ConvexQueryReference>,
>({
    args,
    queryFn,
    key,
    options,
}: UseSyncProps<ConvexQueryReference, Args>) => {
    const convex = useConvex();
    const [data, setData] = useState<FunctionReturnType<ConvexQueryReference>>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        try {
            convex.query(queryFn, ...args).then((d) => {
                setData(d);
                setIsLoading(false);
            });
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (options?.isLocallyStored) {
            const rawData = localStorage.getItem(key(args));
            if (rawData) {
                setData(JSON.parse(rawData));
            }
        }
    }, []);

    return {
        data,
        isLoading,
        error,
    };
};
