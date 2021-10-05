import Header from '@app/components/Header';
import React, { ReactNode } from 'react';
import Head from 'next/head';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="main-layout">
      <Head>
        <title>Exquisite Land</title>

        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      <style jsx>{`
        .main-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
        }
        main {
          flex: 1 1 auto;
        }
      `}</style>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * {
          box-sizing: border-box;
        }
        html,
        body {
          font-size: 16px;
          font-family: 'VT323', monospace;
          margin: 0;
          padding: 0;
          height: 100%;
          background: #333;
        }
        #__next {
          min-height: 100%;
        }
      `}</style>
    </div>
  );
};

export default React.memo(MainLayout);
