import { SimpleEditor } from "@poltion/editor";
import "../../../../packages/editor/src/styles/_variables.scss";
import "../../../../packages/editor/src/styles/_keyframe-animations.scss";
import { observer } from "mobx-react";
import { useParams } from "react-router";

export const EssayPage = observer(function EssayPage() {
  const { id } = useParams();

  return <SimpleEditor id={id ?? "infinite"} />;
});
