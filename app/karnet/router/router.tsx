import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAntiRageClick } from "@/components/help/shortcut-remember";
import { useSettings } from "@/hooks/useStores";
import { ChatHomePage } from "@/old_pages/chat/home";
import { DiagramPage } from "@/old_pages/diagram";
import { PaperPage } from "@/old_pages/paper";
import { DocumentView } from "@/old_pages/view/document.view";
import { TaskView } from "@/old_pages/view/task.view";
import { ChatPage } from "../old_pages/chat";
import { DrawPage } from "../old_pages/sketch";
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
				<Route path="/chat">
					<Route element={<ChatHomePage />} path=":id?" />
				</Route>
				<Route element={<TaskView />} path="/task" />
				<Route path="/diagram">
					<Route element={<DiagramPage />} path=":smallId/:any?" />
				</Route>
				<Route path="/sketch">
					<Route element={<DrawPage />} path=":smallId/:any?" />
				</Route>
				<Route path="/paper">
					<Route element={<PaperPage />} path=":smallId/:any?" />
				</Route>
				<Route element={<DocumentView />} path="/document" />
				<Route element={<Navigate to={"/document"} />} index path="/" />
			</Route>
		</Routes>
	);
};
