import { Route, Routes } from "react-router";
import { DrawPage } from "../pages/draw";
import { AgendaPage } from "../pages/agenda";
import { PagePage } from "../pages/pages";
import { GeneralOutlet } from "./outlet/general.outlet";
import { ChatPage } from "../pages/chat";

export const Router = () => (
  <Routes>
    <Route path="/" element={<GeneralOutlet />}>
      <Route path="/pages" element={<PagePage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/sketches" element={<DrawPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/test" element={<div>test</div>} />
    </Route>
  </Routes>
);
