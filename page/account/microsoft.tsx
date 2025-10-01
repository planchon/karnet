import { Button } from "@ui/button";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const tenantId = "a6c41dba-22ed-4c7b-8df6-f56ce64deb71";
const clientId = "e7f0e4a8-abbe-4c39-b12a-c5cce1fedc20";
const redirectURI = encodeURI("http://localhost:3000/account/microsoft");
const scope =
  "User.Read%20Calendars.ReadWrite.Shared%20Calendars.ReadWrite%20email%20offline_access%20openid%20profile%20People.Read";

export default function MicrosoftOAuth() {
  const navigate = useNavigate();
  const link = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectURI}&response_mode=query&scope=${scope}&prompt=consent`;

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch("/api/account/microsoft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      navigate("/account/microsoft");
    }
  }, [code, navigate]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="container mx-auto flex flex-col gap-4 pt-32">
        <h2 className="text-lg">Link your microsoft calendar</h2>
        <Button asChild className="w-fit">
          <Link target="_top" to={link}>
            Link microsoft calendar
          </Link>
        </Button>
      </div>
    </div>
  );
}
