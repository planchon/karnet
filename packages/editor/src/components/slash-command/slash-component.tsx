export const SlashComponent = () => {
  return (
    <div
      className="bg-background border-border rounded-sm border"
      onKeyDown={(e) => {
        console.log("onKeyDown in comp", e);
        e.stopPropagation();
      }}
    >
      test
    </div>
  );
};
