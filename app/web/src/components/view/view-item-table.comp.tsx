import { useShortcut } from "@/hooks/useShortcut";
import { useSettings } from "@/hooks/useStores";
import { createContext } from "@/lib/create-context";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import { AbstractView, ViewItem as ViewItemType } from "@/view/abstract.view";
import { Icon, IconProps } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import React, { JSX, useRef } from "react";
import { Link } from "react-router";

const ViewContext = createContext<{
  viewModel: AbstractView<any>;
}>("ViewContext");

const ViewContextProvider = ViewContext[0];

const useViewContext = ViewContext[1];

const ViewRoot = <R extends ViewItemType, T extends AbstractView<R>>({
  children,
  viewModel
}: {
  children: React.ReactNode;
  viewModel: T;
}) => {
  return (
    <ViewContextProvider viewModel={viewModel}>
      <div
        id="table-view-body"
        tabIndex={0}
        className="h-full w-full focus:outline-none"
        ref={viewModel.bodyRef}
      >
        {children}
      </div>
    </ViewContextProvider>
  );
};

const ViewBody = <R extends ViewItemType, T extends AbstractView<R>>({
  children
}: {
  children: (item: R) => JSX.Element;
}) => {
  const { viewModel } = useViewContext("ViewBody");

  const data = viewModel.getItems();

  return (
    <div className="flex flex-col">
      {data.map((item: R, index: number) => {
        return (
          <__ViewItem item={item} listIndex={index} key={item.id}>
            {children}
          </__ViewItem>
        );
      })}
    </div>
  );
};

const [LocalItemContextProvider, useLocalItemContext] = createContext<{
  item: ViewItemType;
  listIndex: number;
}>("ViewItemContext");

const __ViewItem = <R extends ViewItemType, T extends AbstractView<R>>({
  item,
  listIndex,
  children
}: {
  item: R;
  listIndex: number;
  children: (item: R) => React.ReactNode;
}) => {
  return (
    <LocalItemContextProvider item={item} listIndex={listIndex}>
      {children(item)}
    </LocalItemContextProvider>
  );
};

const ViewItemLine = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const settings = useSettings();

  const { item, listIndex } = useLocalItemContext("ViewItemLine");

  return (
    <Link
      className={cn(
        "flex h-10 w-full select-none items-center justify-between px-5 py-2",
        "hover:bg-accent-foreground/10",
        className,
        settings.disableLinks && "pointer-events-none select-none"
      )}
      to={`/${item.type}/${item.smallId}`}
      key={item.id}
      data-document-id={item.id}
      data-list-index={listIndex}
      {...props}
    >
      {children}
    </Link>
  );
};

const ViewItemInfos = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row items-center gap-3">{children}</div>;
};

const ViewItemIcon = ({
  children
}: {
  children: React.ReactElement<IconProps>;
}) => {
  return React.cloneElement(children, {
    className: "text-accent-foreground/80 size-4"
  });
};

const ViewItemSmallId = () => {
  const { item } = useLocalItemContext("ViewItemSmallId");

  return (
    <div className="text-accent-foreground/80 w-16 text-sm font-normal">
      {item.smallId}
    </div>
  );
};

// HEADER COMPONENTS

const ViewHeaderBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-10 w-full items-center justify-between border-b">
      <div className="flex h-full w-full select-none flex-row items-center justify-between gap-2 px-4">
        {children}
      </div>
    </div>
  );
};

const ViewHeaderTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-sm font-medium">{children}</span>;
};

const ViewHeaderSpacer = () => {
  return <div className="flex-1" />;
};

const ViewHeaderSearch = ({}: {}) => {
  const { viewModel } = useViewContext("ViewHeaderSearch");
  const searchInputRef = useRef<HTMLInputElement>(null);

  viewModel.searchInputRef = searchInputRef;

  useShortcut("Control+f", (e) => {
    viewModel.searchInputRef?.current?.focus();
    e.preventDefault();
    e.stopPropagation();
  });

  useShortcut("/", (e) => {
    viewModel.searchInputRef?.current?.focus();
    e.preventDefault();
    e.stopPropagation();
  });

  return (
    <div className="focus-within:ring-accent-foreground/30 focus-within:border-accent-foreground/50 focus-within:ring-3 focus-within:border-1 flex h-6 w-40 items-center justify-between rounded-sm border pr-[3px]">
      <Input
        ref={searchInputRef}
        className="h-6 w-full rounded-sm border-none text-xs shadow-none placeholder:text-xs focus:outline-none focus:!ring-0"
        placeholder="Search"
        value={viewModel.query}
        onChange={(e) => {
          viewModel.setSearchQuery(e.target.value);
        }}
      />
      <span className="text-accent-foreground/50 flex aspect-square h-[18px] w-[18px] select-none items-center justify-center rounded-[4px] border text-center font-mono text-[12px]">
        /
      </span>
    </div>
  );
};

const ViewHeaderPossibilities = ({
  name,
  shortcut,
  children
}: {
  name: string;
  shortcut: string[];
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <TooltipWrapper tooltip={{ title: name, side: "bottom", shortcut }}>
        <Button size="sm" variant="outline" asDiv>
          {children}
        </Button>
      </TooltipWrapper>
    </div>
  );
};

export const View = {
  Header: {
    Body: ViewHeaderBody,
    Title: ViewHeaderTitle,
    Spacer: ViewHeaderSpacer,
    Possibilities: ViewHeaderPossibilities,
    Search: ViewHeaderSearch
  },
  Item: {
    Line: ViewItemLine,
    Infos: ViewItemInfos,
    Icon: ViewItemIcon,
    SmallId: ViewItemSmallId
  },
  Root: ViewRoot,
  Body: ViewBody
};
