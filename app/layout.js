import "./globals.css";

export const metadata = {
  title: "QSTools",
  description: "Accurate construction quoting, built for real jobs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}