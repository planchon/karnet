"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Navigate, Route, Routes } from "react-router";
import { ChatWithIdPage } from "@/page/chat/[id]/page";
import { RedirectToPageID } from "@/page/chat/page";
import DocumentPage from "@/page/document/page";
import { ModelsPage } from "@/page/settings/models";
import TaskPage from "@/page/task/page";
import { GeneralOutlet } from "./outlet/general.outlet";

export const GeneralAppRouter = () => (
    <LayoutGroup>
        <AnimatePresence mode="wait">
            <Routes>
                <Route element={<GeneralOutlet />} path="/">
                    <Route path="/settings">
                        <Route element={<ModelsPage />} path="models" />
                        <Route element={<Navigate to="models" />} index />
                    </Route>
                    <Route path="/chat/">
                        <Route element={<ChatWithIdPage />} path=":chatId" />
                        <Route element={<RedirectToPageID />} index />
                    </Route>
                    <Route element={<TaskPage />} path="/task" />
                    <Route element={<DocumentPage />} path="/document" />
                    <Route element={<Navigate to="/chat" />} index />
                </Route>
            </Routes>
        </AnimatePresence>
    </LayoutGroup>
);
