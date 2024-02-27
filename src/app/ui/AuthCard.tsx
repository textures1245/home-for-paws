import { Button, Card, Link, Avatar } from "@radix-ui/themes";
import appLogo from "@/public/home-for-paw-logo.png";

const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="p-2 min-w-80 max-w-full" asChild>
      <div>
        <div id="logo-container" className="flex my-2 justify-center">
          <Avatar fallback="P" size={"7"} src={appLogo.src}></Avatar>
        </div>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </Card>
  );
};

export default AuthCard;
