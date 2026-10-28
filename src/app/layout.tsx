import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReturnModal } from "@/components/ReturnModal";
import { getMarkets } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "GOTV · Markets predict outcomes. Voters create them.", template: "%s · GOTV" },
  description:
    "GOTV is a nonpartisan get-out-the-vote campaign styled as a prediction market. It is not a betting platform. Every trade leads to Vote.gov.",
};

// Every page lists the saved markets, which change without a deploy, so pages render per
// request. The read goes through the Blob CDN, so this stays cheap.
export const dynamic = "force-dynamic";

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const markets = await getMarkets();
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header markets={markets} />
        <main id="main">{children}</main>
        <Footer markets={markets} />
        <ReturnModal />
      </body>
    </html>
  );
}
