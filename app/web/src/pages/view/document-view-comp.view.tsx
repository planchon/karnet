import { useStores } from "@/hooks/useStores";
import { View } from "@/components/view/view-item-table.comp";
import { PaperModel } from "@/models/paper.model";
import { SketchModel } from "@/models/sketch.model";
import { DiagramModel } from "@/models/diagram.model";
import { IconChartDots3, IconFile, IconPalette } from "@tabler/icons-react";

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
          </View.Item.Line>
        )}
      </View.Body>
    </View.Root>
  );
};
