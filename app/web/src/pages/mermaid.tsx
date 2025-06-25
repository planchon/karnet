import MermaidEditor from "@/components/mermaid";
import { observer } from "mobx-react";
import { useParams } from "react-router";

export const MermaidPage = observer(function MermaidPage() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return <MermaidEditor id={id as string} />;
});
