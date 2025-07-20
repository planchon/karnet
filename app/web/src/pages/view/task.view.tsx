import {
  ContextMenuSub,
  ContextMenuSubTrigger,
} from '@radix-ui/react-context-menu';
import { IconPlus } from '@tabler/icons-react';
import { View } from '@/components/view/table';
import { useStores } from '@/hooks/useStores';
import type { TaskModel } from '@/models/task.model';

export const TaskView = () => {
  const { viewStore } = useStores();
  const view = viewStore.getTaskView();

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
            <View.Item.Line>
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
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconPlus className="mr-4" />
              Create
            </ContextMenuSubTrigger>
          </ContextMenuSub>
        </View.Items.Menu>
      </View.Items.Root>
    </View.Root>
  );
};
