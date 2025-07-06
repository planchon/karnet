import { useStores } from "@/hooks/useStores";
import { View } from "@/components/view/view-item-table.comp";
import { PaperModel } from "@/models/paper.model";
import { SketchModel } from "@/models/sketch.model";
import { DiagramModel } from "@/models/diagram.model";
import {
  IconCalendar,
  IconChartDots3,
  IconFile,
  IconPalette
} from "@tabler/icons-react";
import { Label } from "@/primitive/super-ui/label";

export const DocumentViewComp = () => {
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
                {item.type === "paper" ? (
                  <IconFile />
                ) : item.type === "sketch" ? (
                  <IconPalette />
                ) : (
                  <IconChartDots3 />
                )}
              </View.Item.Icon>
              <View.Item.SmallId />
              <div className="text-accent-foreground text-sm font-medium">
                {item.name}
              </div>
            </View.Item.Infos>
            <View.Item.Spacer />
            <View.Item.Labels>
              <Label
                label="test"
                icon={IconCalendar}
                className="bg-background"
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
