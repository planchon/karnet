"use client";

import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import DiagramEditor from "@/components/diagram/diagram.comp";
import { useStores } from "@/hooks/useStores";

export default observer(function DiagramPage() {
	const { id } = useParams<{ id: string }>();
	const { diagramStore } = useStores();

	if (!id) {
		return null;
	}

	const diagram = diagramStore.getBySmallId(id);

	if (!diagram) {
		return null;
	}

	return <DiagramEditor diagram={diagram} />;
});
