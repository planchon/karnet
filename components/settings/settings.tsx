import { Dialog, DialogContent } from "@ui/dialog";

export const SettingsDialog = () => (
    <Dialog open={true}>
        <DialogContent>
            <div className="h-full w-full bg-red-100" />
        </DialogContent>
    </Dialog>
);
