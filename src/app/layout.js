import "./globals.css";
import AppToaster from "@/components/providers/Toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SiteHeader from "@/components/ui/SiteHeader";

export const metadata = {
  title: "Pankaj Pratap Singh",
  description: "Full Stack Developer",
  icons: {
    icon: '/ps.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("portfolio-theme");if(t==="light"){document.documentElement.classList.remove("dark");}else{document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="overflow-x-hidden bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <AppToaster />
          <SiteHeader />
          {children}
          <WhatsAppButton />
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
