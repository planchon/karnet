"use client";

import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useStores } from "@/hooks/useStores";
import { generateId } from "@/lib/utils";

export default observer(function DrawPage() {
	const router = useRouter();
	const { sketchesStore } = useStores();

	const id = generateId();
	const sketch = sketchesStore.createModel(id);

	router.push(`/sketch/${sketch.smallId}`);

	return null;
});
