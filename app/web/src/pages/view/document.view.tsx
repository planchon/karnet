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
import { Link } from 'react-router';
import { View } from '@/components/view/table';
import { useStores } from '@/hooks/useStores';
import type { DiagramModel } from '@/models/diagram.model';
import type { PaperModel } from '@/models/paper.model';
import type { SketchModel } from '@/models/sketch.model';
import { Label } from '@/primitive/super-ui/label';

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
                <Link to="/paper/new">
                  <IconFile className="mr-4" />
                  Papers
                </Link>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <Link to="/diagram/new">
                  <IconChartDots3 className="mr-4" />
                  Diagram
                </Link>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <Link to="/sketch/new">
                  <IconPalette className="mr-4" />
                  Sketch
                </Link>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </View.Items.Menu>
      </View.Items.Root>
    </View.Root>
  );
};
