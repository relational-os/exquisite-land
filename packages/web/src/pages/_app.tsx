import React from "react";
import type { AppProps } from "next/app";
import MainLayout from "@app/layouts/MainLayout";
import Header from "@app/components/header";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header></Header>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

export default App;
