import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AboutWrapper from "@/components/about/AboutWrapper";

export default async function AboutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <AboutWrapper session={session} />;
}
