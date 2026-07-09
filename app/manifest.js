export default function manifest() {
  return {
    name: "情绪释放",
    short_name: "情绪释放",
    description: "把注意从脑中的故事轻轻带回身体里的感受。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f0f5",
    theme_color: "#f3edf4",
    orientation: "portrait",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
