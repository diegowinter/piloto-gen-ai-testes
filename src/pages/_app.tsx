import Layout from "@/components/layout/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ServicesProvider } from "@/context/ServiceContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <ServicesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ServicesProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
