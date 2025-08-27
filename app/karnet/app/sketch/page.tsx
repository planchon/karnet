import { Draw } from "@draw/draw";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import type { SketchModel } from "@/models/sketch.model";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";

const SketchHeader = observer(function SketchHeader({
	sketch,
}: {
	sketch: SketchModel;
}) {
	return (
		<div className="flex h-10 w-full items-center justify-between border-b">
			<div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
				<Input
					className={cn(
						"focus:!ring-0 w-full border-none font-medium focus:border-transparent",
					)}
					onChange={(e) => {
						sketch.setName(e.target.value);
					}}
					placeholder="Drawing name"
					value={sketch.name}
				/>
				<div className="flex flex-row items-center gap-2 pl-2" />
			</div>
			<div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
				<Button size="sm" variant="outline">
					<IconAdjustmentsHorizontal className="size-3" />
					<span className="text-xs">Infos</span>
				</Button>
			</div>
		</div>
	);
});

export const DrawPage = observer(function DrawPage() {
	const { smallId } = useParams();
	const { commandStore, sketchesStore } = useStores();

	if (!smallId) {
		return null;
	}

	const sketch = sketchesStore.getBySmallId(smallId);

	useEffect(() => {
		return () => {
			commandStore.resetContextualCommands();
		};
	}, []);

	if (!sketch) {
		return <div>No id</div>;
	}

	return (
		<div className="h-full w-full">
			<SketchHeader sketch={sketch} />
			<div className="h-[calc(100%-40px)] w-full">
				<Draw
					callback={(editor) => {
						commandStore.setDrawCommands(editor);
					}}
					id={sketch.id}
				/>
			</div>
		</div>
	);
});
