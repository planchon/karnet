import {
	IconCalendar,
	IconChartDots3,
	IconFile,
	IconPalette,
} from "@tabler/icons-react";
import { View } from "@/components/view/view-item-table.comp";
import { useStores } from "@/hooks/useStores";
import type { DiagramModel } from "@/models/diagram.model";
import type { PaperModel } from "@/models/paper.model";
import type { SketchModel } from "@/models/sketch.model";
import { Label } from "@/primitive/super-ui/label";

export const DocumentView = () => {
	const { viewStore } = useStores();

	const view = viewStore.getDocumentView();

	return (
		<View.Root viewModel={view}>
			<View.Header.Body>
				<View.Header.Title>Documents</View.Header.Title>
				<View.Header.Spacer />
				<View.Header.Search />
			</View.Header.Body>
			<View.Body>
				{(item: PaperModel | SketchModel | DiagramModel) => (
					<View.Item.Line>
						<View.Item.Infos>
							<View.Item.Icon>
								{(() => {
									switch (item.type) {
										case "paper":
											return <IconFile />;
										case "sketch":
											return <IconPalette />;
										default:
											return <IconChartDots3 />;
									}
								})()}
							</View.Item.Icon>
							<View.Item.SmallId />
							{item.name && (
								<div className="font-medium text-accent-foreground text-sm">
									{item.name}
								</div>
							)}
							{!item.name && (
								<div className="font-medium text-destructive text-sm">
									Untitled (please name me)
								</div>
							)}
						</View.Item.Infos>
						<View.Item.Spacer />
						<View.Item.Labels>
							<Label
								className="bg-background"
								icon={IconCalendar}
								label="test"
							/>
						</View.Item.Labels>
						<View.Item.Date />
						<View.Item.Author />
					</View.Item.Line>
				)}
			</View.Body>
		</View.Root>
	);
};
