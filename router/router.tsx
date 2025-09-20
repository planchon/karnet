'use client';

import { Route, Routes } from 'react-router';
import { ChatWithIdPage } from '@/page/chat/[id]/page';
import { NewChatPage } from '@/page/chat/page';
import DocumentPage from '@/page/document/page';
import TaskPage from '@/page/task/page';
import { GeneralOutlet } from './outlet/general.outlet';

export const GeneralAppRouter = () => {
    return (
        <Routes>
            <Route element={<GeneralOutlet />} path="/">
                <Route path="/chat/">
                    <Route element={<ChatWithIdPage />} path=":chatId" />
                    <Route element={<NewChatPage />} index />
                </Route>
                <Route element={<TaskPage />} path="/task" />
                <Route element={<DocumentPage />} path="/document" />
            </Route>
        </Routes>
    );
};
