import { observer } from "mobx-react";
import { Navigate, useParams } from "react-router";
import DiagramEditor from "@/components/diagram/diagram.comp";
import { useStores } from "@/hooks/useStores";
import { generateId } from "@/lib/utils";

export const DiagramPage = observer(function DiagramPage() {
	const { smallId } = useParams();

	if (!smallId) {
		return null;
	}

	const { diagramStore } = useStores();

	const diagram = diagramStore.getBySmallId(smallId);

	if (!diagram) {
		return null;
	}

	return <DiagramEditor diagram={diagram} />;
});

export const NewDiagramPage = () => {
	const id = generateId();

	const { diagramStore } = useStores();

	const model = diagramStore.createModel(id);

	return <Navigate to={`/diagram/${model.smallId}`} />;
};