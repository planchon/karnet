import { IconBrain, IconSettings } from "@tabler/icons-react";
import { XIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/primitive/ui/dialog";
import { GeneralSettings } from "./general";
import { ModelsSettings } from "./models";

type SettingsSection = "general" | "models" | "data" | "account";

type NavItem = {
    id: SettingsSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
    { id: "general", label: "General", icon: IconSettings },
    { id: "models", label: "Models", icon: IconBrain },
];

export const SettingsDialog = observer(function SettingsDialogInner() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("general");
    const { settingsStore } = useStores();

    const activeNavItem = navItems.find((item) => item.id === activeSection);

    return (
        <Dialog onOpenChange={() => settingsStore.setIsSettingsOpen(false)} open={settingsStore.isSettingsOpen}>
            <DialogContent
                className="h-[600px] w-[1000px] gap-0 overflow-hidden p-0 dark:bg-background"
                showCloseButton={false}
            >
                <div className="flex h-full w-full">
                    {/* Left Sidebar */}
                    <div className="flex w-64 flex-col border-r bg-muted/30">
                        {/* Close button at top left */}
                        <div className="p-2 pb-2">
                            <DialogClose asChild>
                                <Button className="h-8 w-8" size="icon" variant="ghost">
                                    <XIcon />
                                </Button>
                            </DialogClose>
                        </div>

                        {/* Navigation items */}
                        <nav className="flex-1 px-2 pb-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                            isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                                        )}
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        type="button"
                                    >
                                        <Icon className="size-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex w-full flex-1 flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Section Title */}
                            <h2 className="mb-6 font-semibold text-2xl">{activeNavItem?.label}</h2>

                            {/* General Settings Content */}
                            {activeSection === "general" && <GeneralSettings />}
                            {activeSection === "models" && <ModelsSettings />}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
