import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata={title:'CSHR | Cognitive Runtime',description:'Agent reliability control plane'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
