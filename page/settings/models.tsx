import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Input } from "@ui/input";
import { Switch } from "@ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useMutation } from "convex/react";
import { debounce } from "lodash";
import { AudioLines, Eye, File } from "lucide-react";
import { observer } from "mobx-react";
import { memo, useEffect, useState } from "react";
import { ProviderIcons } from "@/ai/models";
import type { InputModalities } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type KarnetModel, useModels } from "@/hooks/useModels";

export const BaseModality = ({ icon, name, tooltip }: { icon: React.ReactNode; name: string; tooltip: string }) => (
    <Tooltip>
        <TooltipTrigger>
            <div className="flex w-fit items-center gap-2 rounded-full border border-gray-400 px-2">
                {icon}
                <div className="text-gray-900/70 text-sm">{name}</div>
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className="text-sm">{tooltip}</div>
        </TooltipContent>
    </Tooltip>
);

const VisionModality = () => (
    <BaseModality
        icon={<Eye className="size-3 text-gray-900/70" />}
        name="Vision"
        tooltip="This model can process images."
    />
);

const AudioModality = () => (
    <BaseModality
        icon={<AudioLines className="size-3 text-gray-900/70" />}
        name="Audio"
        tooltip="This model can process audio."
    />
);

const FileModality = () => (
    <BaseModality
        icon={<File className="size-3 text-gray-900/70" />}
        name="PDF comprehension"
        tooltip="This model can process PDF files."
    />
);

const TextModality = () => (
    <BaseModality
        icon={<File className="size-3 text-gray-900/70" />}
        name="Text"
        tooltip="This model can process text."
    />
);
const ModalityMap: Record<InputModalities, React.ReactNode> = {
    image: <VisionModality />,
    text: <TextModality />,
    audio: <AudioModality />,
    file: <FileModality />,
};

const ModelCard = memo(({ model, toggleModel }: { model: KarnetModel; toggleModel: (model: KarnetModel) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const shortDescription = `${model.description?.slice(0, 128)}...`;

    return (
        <div className="rounded-md border border-gray-200 p-4">
            <div className="flex items-start gap-4">
                <Tooltip>
                    <TooltipTrigger>
                        <ProviderIcons className="size-16 text-gray-800" provider={model.provider} />
                    </TooltipTrigger>
                    <TooltipContent>{model.provider}</TooltipContent>
                </Tooltip>
                <div className="flex flex-col gap-3">
                    <div className="flex w-full items-center justify-between gap-2">
                        <div className="font-normal">{model.name}</div>
                        <Switch checked={model.active} onCheckedChange={() => toggleModel(model)} />
                    </div>
                    <div className="flex flex-row gap-2">
                        {model.architecture.input_modalities.map((modality) => (
                            <div key={modality}>{ModalityMap[modality]}</div>
                        ))}
                    </div>
                    <div className="font-normal text-sm">{isExpanded ? model.description : shortDescription}</div>
                    <p
                        className="w-fit cursor-pointer text-gray-500 text-sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </p>
                </div>
            </div>
        </div>
    );
});

export const ModelsPage = observer(function ModelsPageInner() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const activateModel = useMutation(api.functions.models.activateModel);
    const deactivateModel = useMutation(api.functions.models.deactivateModel);
    const setDefaultModelMutation = useMutation(api.functions.models.setDefaultModel);

    useEffect(() => {
        const debouncedSetFilter = debounce(() => {
            setFilter(search);
        }, 200);
        debouncedSetFilter();

        return () => {
            debouncedSetFilter.cancel();
        };
    }, [search]);

    const { models, isLoading, error } = useModels();

    const filteredModels = models?.filter(
        (model) =>
            model.name.toLowerCase().includes(filter.toLowerCase()) ||
            model.provider.toLowerCase().includes(filter.toLowerCase()) ||
            model.architecture.input_modalities.some((modality) =>
                modality.toLowerCase().includes(filter.toLowerCase())
            )
    );

    const toggleModel = (model: KarnetModel) => {
        if (model.active) {
            deactivateModel({ id: model.active_id });
        } else {
            activateModel({
                model_id: model.id,
                name: model.name,
                provider: model.provider,
                features: model.architecture.input_modalities,
            });
        }
    };

    const setDefaultModel = (model: KarnetModel & { active_id: Id<"models"> }) => {
        setDefaultModelMutation({ id: model.active_id });
    };

    const defaultModel = models?.find((model) => model.default);

    return (
        <div className="flex h-full w-full flex-col items-center overflow-y-auto">
            <div className="container flex h-full w-full flex-col gap-4 md:max-w-1/2">
                <h2 className="pt-16 font-normal text-xl">Model preferences</h2>
                <p className="font-normal text-sm">
                    Configure and tweak your model preferences. Models are updated daily.
                </p>
                {error && <p>Error: {error.message}</p>}
                <h3>Default model</h3>
                <p className="font-normal text-sm">Choose the model selected by default</p>
                <div className="w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline">
                                {defaultModel?.name || "Select model"} <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {models
                                .filter((model) => model.active)
                                .map((model) => (
                                    <DropdownMenuItem key={model.id} onClick={() => setDefaultModel(model)}>
                                        {model.name}
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h3>Activate models</h3>
                <p className="font-normal text-sm">Configure the model you want to appear in the model selector.</p>
                <Input
                    className="h-auto w-full"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search model, provider, etc..."
                    value={search}
                />
                {isLoading && <p>Loading...</p>}
                {models && (
                    <div className="flex w-full flex-col gap-2">
                        {filteredModels.map((row) => (
                            <ModelCard key={row.id} model={row} toggleModel={toggleModel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});
