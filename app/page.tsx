"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function Home() {
  //const { user } = useUser();
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      // Only redirect after loading is done and no user
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <Image
                src={"/bax_logo.png"}
                width={280}
                height={0}
                alt={"logo"}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Button asChild className={"h-14 px-8 text-lg"}>
                <Link type="submit" href="/api/auth/login" className="w-full">
                  <KeyRound /> Sign In
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
