import create from "zustand";

type CanvasState = {
  svgs: Record<string, string>;
};

const useStore = create<CanvasState>((set) => ({
  svgs: {},
}));

export default useStore;
