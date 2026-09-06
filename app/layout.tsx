// its an special type of file provided by the nextjs that alllows us to render the pages that can access the globbly variables and data from the context container 
// it is used to wrap the entire application and provide the context to all the pages and components in the application
// this avoids the prop drilling and makes the data accessible globally to all the pages and components in the application
// we can wrap the pages of the application with the provider and access the data from the context container in any page or component in the application 
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CertVault — Secure Certificate Management',
  description: 'Organize academic, professional, and skill certificates in one secure digital vault.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
