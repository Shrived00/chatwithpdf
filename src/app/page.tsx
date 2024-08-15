import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {

  const { userId } = auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen min-h-screen 
    bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200">

      <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2">

        <div className="flex flex-col items-center text-center">

          <div className="flex  items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with PDF</h1>
            <UserButton afterSwitchSessionUrl="/" />
          </div>
          <div className="flex mt-2">

            {isAuth && <Button>Go to chats</Button>}

          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">Sign up to use the AI services that both students and working professionals use.</p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>Login to get Started !
                  <LogInIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
