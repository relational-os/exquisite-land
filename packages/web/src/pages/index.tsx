import Surface from "@app/components/surface";
import React from "react";
import Link from "next/link";
import Header from "@app/components/header";

const IndexPage = () => {
  return (
    <div className="index">
      <Header />
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
