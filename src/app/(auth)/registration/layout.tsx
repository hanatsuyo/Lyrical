import Header from "@/components/Header";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header showMenu={false} /> {/* または必要な部分のみ表示するヘッダー */}
      {children}
    </>
  );
}
