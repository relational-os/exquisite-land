import Canvas from "@app/components/Canvas";
import React from "react";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div className="index">
      <Canvas />
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
