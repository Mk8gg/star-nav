import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "GitHub Star · 著名开源软件收录",
  description: "通往未来软件的星图：收录 GitHub 上最具影响力的开源项目，卡片浏览、分类筛选、关键词搜索，star 数每小时自动刷新，与全球开发者一起探索开源宇宙。",
};

const themeScript = `(function(){document.documentElement.dataset.theme='dark';try{localStorage.setItem('theme','dark');}catch(e){}})();`;

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
              <p className="subtitle">开源宇宙导航 · 遇见未来的软件</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
