import { IconChevronDown } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { ImageIcon, Ligature } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { KarnetModel } from "@/hooks/useModels";
import { useModels } from "@/hooks/useModels";
import { Button } from "@/primitive/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/primitive/ui/dropdown-menu";

export const GeneralSettings = () => {
    const { models } = useModels();
    const setDefaultModelMutation = useMutation(api.functions.models.setDefaultModel);
    const setDefaultModel = (model: KarnetModel & { active_id: Id<"models"> }, modality: "text" | "image") => {
        setDefaultModelMutation({ id: model.active_id, modality });
    };

    const defaultModelText = models?.find(
        (model) => model.default && !model.architecture.output_modalities.includes("image")
    );
    const defaultModelImage = models?.find(
        (model) => model.default && model.architecture.output_modalities.includes("image")
    );

    return (
        <div className="space-y-6">
            <h3>Default model</h3>
            <div className="flex flex-col gap-6">
                <div className="flex min-w-1/3 flex-col gap-2">
                    <p className="flex flex-row items-center gap-1 font-normal text-sm">
                        <Ligature className="size-4 text-gray-900/70" />
                        User default text generation model
                    </p>
                    <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">
                                    {defaultModelText?.name || "Select model"} <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {models
                                    .filter((model) => model.active)
                                    .filter((model) => model.architecture.output_modalities.includes("text"))
                                    .filter((model) => !model.architecture.output_modalities.includes("image"))
                                    .filter((model) => !("karnet_default" in model && model.karnet_default))
                                    .map((model) => (
                                        <DropdownMenuItem key={model.id} onClick={() => setDefaultModel(model, "text")}>
                                            {model.name}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="flex flex-row items-center gap-1 font-normal text-sm">
                        <ImageIcon className="size-4 text-gray-900/70" />
                        User default image generation model
                    </p>
                    <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">
                                    {defaultModelImage?.name || "Select model"} <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {models
                                    .filter((model) => model.active)
                                    .filter((model) => model.architecture.output_modalities.includes("image"))
                                    .map((model) => (
                                        <DropdownMenuItem
                                            key={model.id}
                                            onClick={() => setDefaultModel(model, "image")}
                                        >
                                            {model.name}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};
