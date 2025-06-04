import { Navigate, Route, Routes } from "react-router";
import { DrawPage } from "../pages/sketch";
import { AgendaPage } from "../pages/agenda";
import { DocumentPage } from "../pages/document";
import { GeneralOutlet } from "./outlet/general.outlet";
import { ChatPage } from "../pages/chat";
import { ProjectPage } from "@/pages/project";
import { TaskPage } from "@/pages/task";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useStores";
import { EssayPage } from "@/pages/essay";

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
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/sketch">
          <Route path=":id" element={<DrawPage />} />
          <Route path="" index element={<Navigate to={`/sketch/infinite`} />} />
        </Route>
        <Route path="/essay">
          <Route path=":id" index element={<EssayPage />} />
          <Route path="" index element={<Navigate to={`/essay/infinite`} />} />
        </Route>
        <Route path="/document" element={<DocumentPage />} />
        <Route path="/" index element={<Navigate to={`/agenda`} />} />
      </Route>
    </Routes>
  );
};
