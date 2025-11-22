"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Route, Routes } from "react-router";
import { ChatPage } from "@/page/chat/page";
import { LoginPage } from "@/page/login";
import { GeneralOutlet } from "./outlet/general.outlet";
import { Protected } from "./page-wrapper";

export const GeneralAppRouter = () => (
    <LayoutGroup>
        <AnimatePresence mode="wait">
            <Routes>
                <Route element={<LoginPage />} path="/login" />
                <Route element={<Protected />} path="/">
                    <Route element={<GeneralOutlet />} path="/chat">
                        <Route element={<ChatPage />} path=":chatId?" />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    </LayoutGroup>
);
