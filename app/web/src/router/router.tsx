import { Navigate, Route, Routes } from "react-router";
import { DrawPage } from "../pages/sketch";
import { GeneralOutlet } from "./outlet/general.outlet";
import { ChatPage } from "../pages/chat";
import { DocumentView } from "@/pages/view/document.view";
import { TaskPage } from "@/pages/task";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useStores";
import { FilePage } from "@/pages/file";
import { MermaidPage } from "@/pages/mermaid";

export const Router = () => {
  const settings = useSettings();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () =>
      settings.setTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<GeneralOutlet />}>
        {/* <Route path="/agenda" element={<AgendaPage />} /> */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/mermaid">
          <Route path=":id" element={<MermaidPage />} />
        </Route>
        <Route path="/sketch">
          <Route path=":id" element={<DrawPage />} />
        </Route>
        <Route path="/file">
          <Route path=":id" index element={<FilePage />} />
        </Route>
        <Route path="/document" element={<DocumentView />} />
        <Route path="/" index element={<Navigate to={`/file/infinite`} />} />
      </Route>
    </Routes>
  );
};
