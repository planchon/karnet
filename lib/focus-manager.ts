import { useEffect } from "react";
import { useStores } from "@/hooks/useStores";

export class FocusManager {
	private focusElement: HTMLElement | null = null;

	setFocusElement(element: HTMLElement) {
		this.focusElement = element;
	}

	resetFocus() {
		setTimeout(() => {
			if (this.focusElement) {
				this.focusElement.focus();
			}
		}, 0);
	}
}

export const useResetFocus = () => {
	const { focusManager } = useStores();

	return () => {
		focusManager.resetFocus();
	};
};

export const useSetFocusElement = (element: HTMLElement | null) => {
	const { focusManager } = useStores();

	useEffect(() => {
		if (element) {
			focusManager.setFocusElement(element);
		}
	}, [element, focusManager]);
};
