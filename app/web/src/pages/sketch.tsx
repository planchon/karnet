import { Draw } from "@poltion/draw";
import { observer } from "mobx-react";
import { useParams } from "react-router";

export const DrawPage = observer(function DrawPage() {
  const { id } = useParams();

  return <Draw id={id ?? "infinite"} />;
});
