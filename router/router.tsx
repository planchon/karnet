"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Navigate, Route, Routes } from "react-router";
import { ChatWithIdPage } from "@/page/chat/[id]/page";
import { NewChatPage } from "@/page/chat/page";
import { DiagramPage } from "@/page/diagram/page";
import DocumentPage from "@/page/document/page";
import LandingPage from "@/page/landing";
import LoginPage from "@/page/login";
import { PaperPage } from "@/page/paper/page";
import { ModelsPage } from "@/page/settings/models";
import { SketchPage } from "@/page/sketch/page";
import TaskPage from "@/page/task/page";
import { GeneralOutlet } from "./outlet/general.outlet";
import { Protected } from "./page-wrapper";

export const GeneralAppRouter = () => (
    <LayoutGroup>
        <AnimatePresence mode="wait">
            <Routes>
                <Route element={<LoginPage />} path="/login/*" />
                <Route element={<LandingPage />} index path="/" />
                <Route element={<Protected />} path="/">
                    <Route element={<GeneralOutlet />} path="/">
                        <Route path="/settings">
                            <Route element={<ModelsPage />} path="models" />
                            <Route element={<Navigate to="models" />} index />
                        </Route>
                        <Route path="/chat/">
                            <Route element={<ChatWithIdPage />} path=":chatId" />
                            <Route element={<NewChatPage />} index />
                        </Route>
                        <Route element={<PaperPage />} path="/paper/:paperId/:paperSlug" />
                        <Route element={<DiagramPage />} path="/diagram/:diagramId/:diagramSlug" />
                        <Route element={<SketchPage />} path="/sketch/:sketchId/:sketchSlug" />
                        <Route element={<TaskPage />} path="/task" />
                        <Route element={<DocumentPage />} path="/document" />
                        <Route element={<Navigate to="/chat" />} index />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    </LayoutGroup>
);
