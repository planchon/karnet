import { useMutation } from "convex/react";
import type { FunctionArgs } from "convex/server";
import { throttle } from "lodash";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useSync, useSyncOnce } from "./useSync";

const useMutateDocument = (args: FunctionArgs<typeof api.functions.documents.getDocumentBySmallId>) =>
    useMutation(api.functions.documents.updateDocument).withOptimisticUpdate((localStore, updateArgs) => {
        // update the local query
        const currentItem = localStore.getQuery(api.functions.documents.getDocumentBySmallId, args);

        if (currentItem) {
            localStore.setQuery(api.functions.documents.getDocumentBySmallId, args, {
                ...currentItem,
                ...updateArgs,
            });
        }

        const currentAll = localStore.getQuery(api.functions.documents.getUserDocuments);

        if (currentAll) {
            const oldItems = currentAll.find((q) => q._id === updateArgs.id);
            if (!oldItems) return;

            const filteredItems = currentAll.filter((q) => q._id !== updateArgs.id);

            const newItem = {
                ...oldItems,
                ...updateArgs,
            };

            const newItems = [...filteredItems, newItem];
            localStore.setQuery(api.functions.documents.getUserDocuments, {}, newItems);
        }
    });

type UseDocumentProps = {
    args: FunctionArgs<typeof api.functions.documents.getDocumentBySmallId>;
    options?: {
        isLocallyStored?: boolean;
        debounceTime?: number;
    };
};
/**
 *
 * @param smallId The small id of the document to get
 */
export const useDocument = ({ args, options }: UseDocumentProps) => {
    const { data, isLoading, error } = useSync({
        args,
        queryFn: api.functions.documents.getDocumentBySmallId,
        key: (a) => `${a.type}:${a.smallId}`,
        options,
    });

    const updateData = useMutateDocument(args);

    const saveToLocalStorage = throttle(() => {
        if (data) {
            localStorage.setItem(`${args.type}:${args.smallId}`, JSON.stringify(data));
        }
    }, options?.debounceTime ?? 500);

    useEffect(() => {
        if (!options?.isLocallyStored) return;

        saveToLocalStorage();
    }, [data, options?.isLocallyStored]);

    return {
        document: data,
        isLoading,
        error,
        updateData,
    };
};

export const useDocumentOnce = ({ args, options }: UseDocumentProps) => {
    const { data, isLoading } = useSyncOnce({
        args: [args],
        queryFn: api.functions.documents.getDocumentBySmallId,
        key: () => `${args.type}:${args.smallId}`,
        options,
    });

    const updateData = useMutateDocument(args);

    return {
        data,
        isLoading,
        updateData,
    };
};
