import { useStores } from "@/hooks/useStores";
import { Draw } from "@poltion/draw";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";

export const DrawPage = observer(function DrawPage() {
  const { id } = useParams();
  const { commandStore } = useStores();

  useEffect(() => {
    return () => {
      commandStore.resetContextualCommands();
    };
  }, []);

  return (
    <Draw
      id={id ?? "infinite"}
      callback={(editor) => {
        commandStore.setDrawCommands(editor);
      }}
    />
  );
});
