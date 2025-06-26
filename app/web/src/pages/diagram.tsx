import DiagramEditor from "@/components/diagram/diagram.comp";
import { observer } from "mobx-react";
import { useParams } from "react-router";

export const DiagramPage = observer(function DiagramPage() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return <DiagramEditor id={id as string} />;
});
