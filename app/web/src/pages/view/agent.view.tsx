import { IconRobot } from '@tabler/icons-react';
import { ContextMenuSub } from '@ui/context-menu';
import { observer } from 'mobx-react';
import { View } from '@/components/view/table';
import { useStores } from '@/hooks/useStores';
import type { AgentModel } from '@/models/agent.model';

export const AgentView = observer(function AgentViewInner() {
  const { viewStore } = useStores();
  const view = viewStore.getAgentView();

  console.log(view);

  return (
    <View.Root viewModel={view}>
      <View.Header.Body>
        <View.Header.Title>Agents</View.Header.Title>
        <View.Header.Spacer />
        <View.Header.Search />
      </View.Header.Body>
      <View.Items.Root>
        <View.Items.List>
          {(item: AgentModel) => (
            <View.Item.Line>
              <View.Item.Infos>
                <View.Item.Icon>
                  <IconRobot />
                </View.Item.Icon>
                <View.Item.SmallId />
              </View.Item.Infos>
              <View.Item.Spacer />
            </View.Item.Line>
          )}
        </View.Items.List>
        <View.Items.Menu>
          <ContextMenuSub />
        </View.Items.Menu>
      </View.Items.Root>
    </View.Root>
  );
});
