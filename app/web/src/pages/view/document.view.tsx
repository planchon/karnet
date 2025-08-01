import {
  IconCalendar,
  IconChartDots3,
  IconCopy,
  IconFile,
  IconId,
  IconLink,
  IconPalette,
  IconPencil,
  IconPlus,
  IconStar,
  IconTrash,
} from '@tabler/icons-react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@ui/context-menu';
import { useNavigate } from 'react-router';
import { View } from '@/components/view/table';
import { useStores } from '@/hooks/useStores';
import { generateId } from '@/lib/utils';
import type { DiagramModel } from '@/models/diagram.model';
import type { PaperModel } from '@/models/paper.model';
import type { SketchModel } from '@/models/sketch.model';
import { Label } from '@/primitive/super-ui/label';

export const DocumentView = () => {
  const { viewStore } = useStores();
  const view = viewStore.getDocumentView();
  const { paperStore, sketchesStore, diagramStore } = useStores();
  const navigate = useNavigate();

  return (
    <View.Root viewModel={view}>
      <View.Header.Body>
        <View.Header.Title>Documents</View.Header.Title>
        <View.Header.Spacer />
        <View.Header.Search />
      </View.Header.Body>
      <View.Items.Root>
        <View.Items.List>
          {(item: PaperModel | SketchModel | DiagramModel) => (
            <View.Item.Line>
              <View.Item.Infos>
                <View.Item.Icon>
                  {(() => {
                    switch (item.type) {
                      case 'paper':
                        return <IconFile />;
                      case 'sketch':
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
              <View.Item.Tags>
                <View.Item.Labels>
                  <Label
                    className="bg-background"
                    icon={IconCalendar}
                    label="test"
                  />
                </View.Item.Labels>
                <View.Item.Author />
                <View.Item.Date />
              </View.Item.Tags>
              <View.Item.ContextMenu>
                <ContextMenuItem>
                  <IconPencil className="mr-2" />
                  <span>Rename</span>
                </ContextMenuItem>
                <ContextMenuItem>
                  <IconStar className="mr-2" />
                  <span>Favorite</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <IconCopy className="mr-4" />
                    <span>Copy</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>
                      <IconId className="mr-2" />
                      <span>Copy ID</span>
                      <ContextMenuShortcut>
                        <span>⌘.</span>
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <IconLink className="mr-2" />
                      <span>Copy URL</span>
                      <ContextMenuShortcut>
                        <span>⌘L</span>
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <IconTrash className="mr-2 text-destructive" />
                  <span className="text-destructive">Delete</span>
                </ContextMenuItem>
              </View.Item.ContextMenu>
            </View.Item.Line>
          )}
        </View.Items.List>
        <View.Items.Menu>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconPlus className="mr-4" />
              Create
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              <ContextMenuItem asChild>
                <button
                  className="w-full"
                  onClick={() => {
                    const id = generateId();
                    const paper = paperStore.createModel(id);
                    navigate(`/paper/${paper.smallId}`);
                  }}
                  type="button"
                >
                  <IconFile className="mr-4" />
                  Papers
                </button>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <button
                  className="w-full"
                  onClick={() => {
                    const id = generateId();
                    const diagram = diagramStore.createModel(id);
                    navigate(`/diagram/${diagram.smallId}`);
                  }}
                  type="button"
                >
                  <IconChartDots3 className="mr-4" />
                  Diagram
                </button>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <button
                  className="w-full"
                  onClick={() => {
                    const id = generateId();
                    const sketch = sketchesStore.createModel(id);
                    navigate(`/sketch/${sketch.smallId}`);
                  }}
                  type="button"
                >
                  <IconPalette className="mr-4" />
                  Sketch
                </button>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </View.Items.Menu>
      </View.Items.Root>
    </View.Root>
  );
};
