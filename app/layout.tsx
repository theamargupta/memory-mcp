import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-cabinet",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mcp.devfrend.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Memory MCP — Your AI Tools' Shared Brain",
    template: "%s · Memory MCP",
  },
  description:
    "Open-source MCP server that gives Claude, Cursor, and Codex a shared, semantically-searchable memory. OAuth 2.0 + PKCE, pgvector embeddings, multi-project scoping. Built by Amar Gupta as a portfolio piece.",
  applicationName: "Memory MCP",
  authors: [{ name: "Amar Gupta", url: "https://amargupta.tech" }],
  creator: "Amar Gupta",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "Claude",
    "Cursor",
    "Codex",
    "AI memory",
    "semantic search",
    "pgvector",
    "Supabase",
    "OAuth",
    "Amar Gupta",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Memory MCP",
    title: "Memory MCP — Your AI Tools' Shared Brain",
    description:
      "Store your knowledge once. Every AI tool remembers. Semantic search, OAuth, pgvector. By Amar Gupta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory MCP — Your AI Tools' Shared Brain",
    description:
      "Open-source MCP server with semantic memory across Claude, Cursor, and Codex. Built by Amar Gupta.",
    creator: "@theamargupta",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-noise">{children}</body>
    </html>
  );
}
