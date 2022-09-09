import dynamic from "next/dynamic";

export { default as Divider } from "./Divider";
export { default as Ellipsis } from "./Ellipsis";
export { default as ProgressBar } from "./ProgressBar";
export { default as BaseComponent } from "./BaseComponent";
export { default as ResizableContainer } from "./ResizableContainer";

export const VisualizationViewer = dynamic(
  () => import("./VisualizationViewer"),
  { ssr: false }
);
