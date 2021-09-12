import useStore from "@app/features/State";
import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const Header = () => {
  const canvases = useStore((state) => state.canvases);

  const setActiveCanvas = (id: number) => {
    useStore.setState({ activeCanvas: id });
  };

  return (
    <div className="header">
      <ConnectWalletButton />

      <select onChange={(e) => setActiveCanvas(parseInt(e.target.value))}>
        {canvases.map((canvas) => {
          return (
            <option key={canvas.id} value={canvas.id}>
              Canvas {`${canvas.id}`}
            </option>
          );
        })}
      </select>

      <style jsx>{`
        .header {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Header;
