import { SimpleEditor } from "@poltion/editor";
import "../../../../packages/editor/src/styles/_variables.scss";
import "../../../../packages/editor/src/styles/_keyframe-animations.scss";
import { observer } from "mobx-react";

export const DocumentPage = observer(function DocumentPage() {
  return <SimpleEditor />;
});
