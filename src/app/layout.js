import "./globals.css";
import AppToaster from "@/components/providers/Toaster";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Pankaj Pratap Singh",
  description: "Full Stack Developer",
  icons: {
    icon: '/ps.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <AppToaster />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
