import Header from '@/components/shared/header';
import Footer from '@/components/footer';
import TableInitializer from '@/components/shared/TableInitializer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <TableInitializer />
      <Header />
        <main className='flex-1 wrapper'>
            {children}
        </main>
      <Footer />
    </div>
  );
}