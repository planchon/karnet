import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAntiRageClick } from "@/components/help/shortcut-remember";
import { useSettings } from "@/hooks/useStores";
import { DiagramPage } from "@/pages/diagram";
import { PaperPage } from "@/pages/paper";
import { TaskPage } from "@/pages/task";
import { DocumentView } from "@/pages/view/document.view";
import { ChatPage } from "../pages/chat";
import { DrawPage } from "../pages/sketch";
import { GeneralOutlet } from "./outlet/general.outlet";

export const Router = () => {
	const settings = useSettings();

	useAntiRageClick();

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () =>
			settings.setTheme(mediaQuery.matches ? "dark" : "light");
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [settings]);

	return (
		<Routes>
			<Route element={<GeneralOutlet />} path="/">
				{/* <Route path="/agenda" element={<AgendaPage />} /> */}
				<Route element={<ChatPage />} path="/chat" />
				<Route element={<TaskPage />} path="/task" />
				<Route path="/diagram">
					<Route element={<DiagramPage />} path=":id" />
				</Route>
				<Route path="/sketch">
					<Route element={<DrawPage />} path=":id" />
				</Route>
				<Route path="/paper">
					<Route element={<PaperPage />} index path=":id" />
				</Route>
				<Route element={<DocumentView />} path="/document" />
				<Route element={<Navigate to={"/document"} />} index path="/" />
			</Route>
		</Routes>
	);
};
