import { SignIn } from "@clerk/react-router";
export const LoginPage = () => (
    <div className="flex h-screen w-screen items-center justify-center">
        <SignIn forceRedirectUrl={"/chat"} />
    </div>
);
