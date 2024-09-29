import { AuthProvider } from "@propelauth/nextjs/client";
import "./globals.css"; // CSS for the app

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
        <AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL}>
        <body>{children}      </body>

        </AuthProvider>
    </html>
  );
}
