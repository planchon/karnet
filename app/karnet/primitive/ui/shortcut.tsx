const SingleShortcut = ({ shortcut }: { shortcut: string }) => {
  return (
    <span className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded-[3px] border bg-white p-[2px] text-xs">
      {shortcut.toUpperCase()}
    </span>
  );
};

export const Shortcut = ({
  shortcut,
  nothen
}: {
  shortcut: string[];
  nothen?: boolean;
}) => {
  if (shortcut.length === 1) {
    return <SingleShortcut shortcut={shortcut[0]!} />;
  }

  if (shortcut.length === 2) {
    return (
      <div className="flex items-center justify-center gap-1">
        <SingleShortcut shortcut={shortcut[0]!} />
        {!nothen && <span className="text-muted-foreground text-xs">then</span>}
        <SingleShortcut shortcut={shortcut[1]!} />
      </div>
    );
  }

  if (shortcut.length === 3) {
    return (
      <div className="flex justify-center gap-1">
        <SingleShortcut shortcut={`${shortcut[0]!}+${shortcut[1]!}`} />
        {!nothen && <span className="text-muted-foreground text-xs">then</span>}
        <SingleShortcut shortcut={shortcut[2]!} />
      </div>
    );
  }
};
