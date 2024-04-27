import Layout from "@/components/layout/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ServicesProvider } from "@/context/ServiceContext";
import 'regenerator-runtime/runtime';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <ServicesProvider>
          <Layout>
            <main className="light dark:dark">
              <Component {...pageProps} />
            </main>
          </Layout>
        </ServicesProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
