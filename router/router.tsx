"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Navigate, Route, Routes } from "react-router";
import { ChatWithIdPage } from "@/page/chat/[id]/page";
import { NewChatPage } from "@/page/chat/page";
import { LoginPage } from "@/page/login";
import { ModelsPage } from "@/page/settings/models";
import { GeneralOutlet } from "./outlet/general.outlet";
import { Protected } from "./page-wrapper";

export const GeneralAppRouter = () => (
    <LayoutGroup>
        <AnimatePresence mode="wait">
            <Routes>
                <Route element={<LoginPage />} path="/login" />
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
                        <Route element={<Navigate to="/chat" />} index />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    </LayoutGroup>
);
