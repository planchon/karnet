import { Route, Routes } from "react-router";
import { DrawPage } from "../pages/draw";
import { AgendaPage } from "../pages/agenda";
import { PagePage } from "../pages/pages";
import { GeneralOutlet } from "./outlet/general.outlet";
import { ChatPage } from "../pages/chat";
import { ProjectPage } from "@/pages/project";
import { TaskPage } from "@/pages/task";
import { useEffect } from "react";
import { toggleTheme } from "@/stores/settings";

export const Router = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => toggleTheme();
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
        <Route path="/sketches" element={<DrawPage />} />
        <Route path="/pages" element={<PagePage />} />
      </Route>
    </Routes>
  );
};
