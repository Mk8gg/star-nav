import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "GitHub Star · 著名开源软件收录",
  description: "一目了然的 GitHub 著名开源软件收录页：卡片浏览、分类筛选、关键词搜索，star 数每小时自动刷新。",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.dataset.theme=t;}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <div>
              <h1>⭐ GitHub Star</h1>
              <p className="subtitle">GitHub 著名开源软件收录 · 打开就一目了然</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
