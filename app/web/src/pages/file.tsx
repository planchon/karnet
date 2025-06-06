import { SimpleEditor } from "@poltion/editor";
import "../../../../packages/editor/src/styles/_variables.scss";
import "../../../../packages/editor/src/styles/_keyframe-animations.scss";
import { observer } from "mobx-react";
import { useParams } from "react-router";

export const FilePage = observer(function FilePage() {
  const { id } = useParams();

  console.log("id params", id);

  return <SimpleEditor key={id} id={id ?? "infinite"} />;
});
