import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import DiagramEditor from "@/components/diagram/diagram.comp";
import { useStores } from "@/hooks/useStores";

export const DiagramPage = observer(function DiagramPage() {
	const { smallId } = useParams();
	const { diagramStore } = useStores();

	if (!smallId) {
		return null;
	}

	const diagram = diagramStore.getBySmallId(smallId);

	if (!diagram) {
		return null;
	}

	return <DiagramEditor diagram={diagram} />;
});
