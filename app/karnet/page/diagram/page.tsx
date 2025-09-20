"use client";

import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useStores } from "@/hooks/useStores";
import { generateId } from "@/lib/utils";

export default observer(function DiagramPage() {
	const router = useRouter();
	const { diagramStore } = useStores();

	const id = generateId();
	const newDiagram = diagramStore.createModel(id);

	router.push(`/diagram/${newDiagram.smallId}`);

	return null;
});
