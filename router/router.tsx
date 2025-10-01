"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Route, Routes } from "react-router";
import { ChatWithIdPage } from "@/page/chat/[id]/page";
import { NewChatPage } from "@/page/chat/page";
import DocumentPage from "@/page/document/page";
import TaskPage from "@/page/task/page";
import { GeneralOutlet } from "./outlet/general.outlet";
import MicrosoftOAuth from "@/page/account/microsoft";

export const GeneralAppRouter = () => (
    <LayoutGroup>
        <AnimatePresence mode="wait">
            <Routes>
                <Route element={<GeneralOutlet />} path="/">
                    <Route element={<MicrosoftOAuth />} path="/account/microsoft" />
                    <Route path="/chat/">
                        <Route element={<ChatWithIdPage />} path=":chatId" />
                        <Route element={<NewChatPage />} index />
                    </Route>
                    <Route element={<TaskPage />} path="/task" />
                    <Route element={<DocumentPage />} path="/document" />
                </Route>
            </Routes>
        </AnimatePresence>
    </LayoutGroup>
);
