import { Route, Routes } from "react-router";
import { DrawPage } from "../pages/draw";
import { CalendarPage } from "../pages/calendar";
import { PagePage } from "../pages/pages";

export const Router = () => (
  <Routes>
    <Route path="/pages" element={<PagePage />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/draw" element={<DrawPage />} />
  </Routes>
);
