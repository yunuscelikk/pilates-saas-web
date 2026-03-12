import "./globals.css";
import Providers from "@/components/providers";

export const metadata = {
  title: "Pilates Studio - Admin Panel",
  description: "Pilates Studio SaaS Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
