import { useStores } from "@/hooks/useStores";
import { Draw } from "@poltion/draw";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";

export const DrawPage = observer(function DrawPage() {
  const { id } = useParams();
  const { commandStore } = useStores();

  return (
    <Draw
      id={id ?? "infinite"}
      callback={(editor) => {
        commandStore.setDrawCommands(editor);
      }}
    />
  );
});
