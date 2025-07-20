import type { IconProps } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { Checkbox } from '@ui/checkbox';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@ui/context-menu';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router';
import { useSettings } from '@/hooks/useStores';
import { cn, slugify } from '@/lib/utils';
import { useLocalItemContext } from './items.table';
import { useViewContext } from './root.table';

export const ViewItemLine = observer(
  ({
    className,
    children,
    isLink = true,
    ...props
  }: {
    className?: string;
    children: React.ReactElement[];
    isLink?: boolean;
  }) => {
    const settings = useSettings();

    const { item, listIndex } = useLocalItemContext('ViewItemLine');
    const { viewModel, navigation } = useViewContext('ViewItemLine');

    const isSelected = listIndex === viewModel._selectedIndex;

    const everythingElse = children.filter((c) => {
      if (c === null || c === undefined) {
        return false;
      }

      return c.type !== ViewItemContextMenu;
    });

    const contextMenu = children.filter((c) => {
      return c.type === ViewItemContextMenu;
    });

    const Component = isLink ? Link : 'div';

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Component
            className={cn(
              'z-10 flex h-10 w-full select-none items-center justify-between py-2 pr-5 pl-3 hover:cursor-pointer focus:outline-none',
              navigation.mode === 'mouse' &&
                'cursor-pointer hover:bg-accent-foreground/10',
              navigation.mode === 'keyboard' &&
                isSelected &&
                'bg-accent-foreground/10',
              navigation.mode === 'focus' &&
                isSelected &&
                'bg-accent-foreground/10',
              settings.disableLinks && 'pointer-events-none select-none',
              className
            )}
            data-document-id={item.id}
            data-list-index={listIndex}
            id={`view-item-line-${item.smallId}`}
            key={item.id}
            onFocus={() => {
              navigation.setMode('focus');
              viewModel.setSelectedIndex(listIndex);
            }}
            to={`/${item.type}/${item.smallId}/${slugify(item.name)}`}
            {...props}
          >
            {everythingElse}
          </Component>
        </ContextMenuTrigger>
        {contextMenu}
      </ContextMenu>
    );
  }
);

export const ViewItemInfos = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-3 pl-1" id="view-item-infos">
      {children}
    </div>
  );
};

export const ViewItemTags = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-3" id="view-item-tags">
      {children}
    </div>
  );
};

export const ViewItemIcon = ({
  children,
}: {
  children: React.ReactElement<IconProps>;
}) => {
  return React.cloneElement(children, {
    className: 'text-accent-foreground/80 size-4',
  });
};

export const ViewItemSmallId = () => {
  const { item } = useLocalItemContext('ViewItemSmallId');

  return (
    <div
      className="w-16 font-normal text-accent-foreground/80 text-sm"
      id="view-item-small-id"
    >
      {item.smallId}
    </div>
  );
};

export const ViewItemLabels = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-2" id="view-item-labels">
      {children}
    </div>
  );
};

export const ViewItemDate = () => {
  return (
    <div className="text-[12px] text-accent-foreground/70" id="view-item-date">
      Mer 24.06
    </div>
  );
};

export const ViewItemAuthor = () => {
  return (
    <div id="view-item-author">
      <Avatar className="size-5">
        <AvatarImage src="https://github.com/planchon.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export const ViewItemContextMenu = observer(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <ContextMenuContent className="w-48 overflow-hidden">
        {children}
      </ContextMenuContent>
    );
  }
);

export const ViewItemCheckbox = () => {
  return (
    <div className="group z-[1000] flex size-8 items-center justify-center transition-all duration-300">
      <Checkbox
        className="size-4 group-hover:border-accent-foreground/50"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
