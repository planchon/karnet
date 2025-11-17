import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

export const NewChatButton = () => (
    <div className="w-full">
        <Link to="/chat">
            <Button className="w-full" variant="outline">
                <PlusIcon className="size-3" />
                <span className="text-xs">New chat</span>
            </Button>
        </Link>
    </div>
);
