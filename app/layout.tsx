import './globals.css';
import type { Metadata } from 'next';
import { UserProvider } from './components/UserContext';

export const metadata: Metadata = {
  title: 'SugarBabes',
  description: 'Exklusiv dejting för sofistikerade personer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
} 