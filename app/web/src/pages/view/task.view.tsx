import { IconPlus } from '@tabler/icons-react';
import { ContextMenuItem } from '@ui/context-menu';
import { View } from '@/components/view/table';
import { useCommands } from '@/hooks/useShortcut';
import { useStores } from '@/hooks/useStores';
import type { TaskModel } from '@/models/task.model';

export const TaskView = () => {
  const { viewStore } = useStores();
  const view = viewStore.getTaskView();
  const commands = useCommands();

  return (
    <View.Root viewModel={view}>
      <View.Header.Body>
        <View.Header.Title>Tasks</View.Header.Title>
        <View.Header.Spacer />
        <View.Header.Search />
      </View.Header.Body>
      <View.Items.Root>
        <View.Items.List>
          {(item: TaskModel) => (
            <View.Item.Line isLink={false}>
              <View.Item.Checkbox />
              <View.Item.Infos>
                <View.Item.SmallId />
                {item.title && (
                  <div className="font-medium text-accent-foreground text-sm">
                    {item.title}
                  </div>
                )}
              </View.Item.Infos>
              <View.Item.Spacer />
              <View.Item.Tags>
                <View.Item.Author />
                <View.Item.Date />
              </View.Item.Tags>
            </View.Item.Line>
          )}
        </View.Items.List>
        <View.Items.Menu>
          <ContextMenuItem
            onSelect={() => {
              commands.toggleTask();
            }}
          >
            <IconPlus className="mr-4" />
            New task
          </ContextMenuItem>
        </View.Items.Menu>
      </View.Items.Root>
    </View.Root>
  );
};
