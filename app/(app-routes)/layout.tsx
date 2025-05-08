import Menubar from "../components/Menubar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <Menubar />
    </div>
  );
}
