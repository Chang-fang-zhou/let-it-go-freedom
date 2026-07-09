import "./globals.css";

export const metadata = {
  title: "情绪释放",
  description: "一个安静、柔和、适合在强烈情绪时使用的手机端释放小工具。",
  applicationName: "情绪释放",
  icons: {
    icon: [
      { url: "/icon-192.svg", type: "image/svg+xml" },
      { url: "/icon-512.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon-192.svg"]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "情绪释放"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3edf4"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
