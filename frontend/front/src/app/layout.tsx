import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiProvider } from "@/utils/wagmi";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "ostraka",
    description:
        "Embrace a new era of voting with unprecedented freedom and expression",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ChakraProvider>
                    <WagmiProvider>{children}</WagmiProvider>
                </ChakraProvider>
            </body>
        </html>
    );
}
