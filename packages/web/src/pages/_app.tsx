import React from 'react';
import type { AppProps } from 'next/app';
import MainLayout from '@app/layouts/MainLayout';
import { EthereumProviders } from '@app/EthereumProviders';

function App({ Component, pageProps }: AppProps) {
  return (
    <EthereumProviders>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </EthereumProviders>
  );
}

export default App;
