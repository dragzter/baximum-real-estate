import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Upload } from "lucide-react";

export default function PageNav() {
  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between bg-background">
      <div className="text-2xl font-bold">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/bax_logo.png"} width={130} height={0} alt={"logo"} />
        </Link>
      </div>
      <div className="space-x-4">
        <Button variant="outline" asChild>
          <Link href="/profile">
            <Upload className="h-4 w-4" /> Upload Deal
          </Link>
        </Button>
        <Button asChild>
          <Link href="/api/auth/logout" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </nav>
  );
}
