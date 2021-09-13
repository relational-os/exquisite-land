import Header from '@app/components/Header';
import React, { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="main-layout">
      <header>
        <Header />
      </header>
      {children}
      <style jsx>{`
        .main-layout {
        }
        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
      `}</style>
      <style jsx global>{`
        @font-face {
          font-family: Aldi;
          font-weight: regular;
          src: url('/fonts/Aldi-Regular.otf') format('opentype');
        }
        @font-face {
          font-family: Aldi;
          font-weight: bold;
          src: url('/fonts/Aldi-Bold.otf') format('opentype');
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          font-family: Aldi, ui-rounded, 'SF Pro Rounded', -apple-system,
            BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
