import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "NorthBound Gather",
  description: "Event coordination for the Canadian outdoor community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-background text-foreground`}>
        <AuthContextProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
