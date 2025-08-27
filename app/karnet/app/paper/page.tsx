"use client";

import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useStores } from "@/hooks/useStores";
import { generateId } from "@/lib/utils";

export default observer(function PaperPage() {
	const router = useRouter();
	const { paperStore } = useStores();

	const id = generateId();
	const paper = paperStore.createModel(id);

	router.push(`/paper/${paper.smallId}`);

	return null;
});
