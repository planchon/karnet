import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { generateId } from "@/lib/utils";
import { Button } from "../ui/button";

export const NewChatButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const nonce = generateId();
        navigate("/chat", { state: { nonce } });
    };

    return (
        <div className="w-full pb-2">
            <button className="w-full" onClick={handleClick} type="button">
                <Button className="w-full" variant="outline">
                    <PlusIcon className="size-3" />
                    <span className="text-xs">New chat</span>
                </Button>
            </button>
        </div>
    );
};
