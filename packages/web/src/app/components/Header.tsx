import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const Header = () => {
  return (
    <div className="header">
      <ConnectWalletButton />
      <style jsx>{`
        .header {
        }
      `}</style>
    </div>
  );
};

export default Header;
