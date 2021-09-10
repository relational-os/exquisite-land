import Surface from "@app/components/surface";
import React from "react";
import Link from "next/link";
import ConnectWalletButton from "@app/components/connectWalletButton";

const IndexPage = () => {
  return (
    <div className="index">
      <Surface />
      <Link href="/edit">
        <a>Editor</a>
      </Link>
      <style jsx>{`
        .index {
        }
      `}</style>
    </div>
  );
};

export default IndexPage;
