import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SiteHeader from "@/components/layout/SiteHeader";
import MessageSubscriber from "@/components/realtime/MessageSubscriber";
import { createClient } from "@/lib/supabase/server";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyMarket - Drone Service Marketplace",
  description: "Find trusted drone operators for delivery, courier, and aerial services in Detroit Metro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* site header */}
        <SiteHeader />
        {user ? (
          // Client subscriber for realtime notifications
          <MessageSubscriber userId={user.id} />
        ) : null}
        {children}
        <Toaster />
        <ChatLauncher />
      </body>
    </html>
  );
}
