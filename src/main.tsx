import "./main.css";

import HoverPlayer from "./lib/HoverPlayer";
import { getTopLevelReadableElementsOnPage } from "./lib/parser";
import { useHoveredParagraphCoordinate } from "./lib/hook";

export function Main() {
  const elements = getTopLevelReadableElementsOnPage()
  useHoveredParagraphCoordinate(elements as HTMLElement[]);
  console.log({elements});

  return <HoverPlayer />;
}
