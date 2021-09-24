import Head from 'next/head';
import React, { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Exquisite Land</title>
      </Head>
      {children}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html,
        body {
          font-family: 'Helvetica Now', -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: lightblue;
        }
        body {
          min-height: 100vh;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        @font-face {
          font-family: 'Helvetica Now';
          src: url('/static/fonts/HelveticaNowDisplay-Regular.otf');
          font-weight: normal;
        }
        @font-face {
          font-family: 'Helvetica Now';
          src: url('/static/fonts/HelveticaNowDisplay-Bold.otf');
          font-weight: bold;
        }
        @font-face {
          font-family: 'Mono';
          src: url('/static/fonts/Mono.ttf');
          font-weight: normal;
        }
      `}</style>
    </>
  );
};

export default MainLayout;
