// This is a simple play button SVG that you can use in your hover player
import { type SVGProps, type CSSProperties, useState, useRef, useEffect, useCallback } from "react";
import { HoveredElementInfo, useHoveredParagraphCoordinate } from "./hook";
import { getTopLevelReadableElementsOnPage } from "./parser";
import { speechify } from "./play";

const PlayButton = (props: SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
  <svg
    id="play-icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: "pointer",
      background: "#6B78FC",
      borderRadius: "50%",
    }}
    {...props}
  >
    <path
      d="M16.3711 11.3506C16.8711 11.6393 16.8711 12.361 16.3711 12.6497L10.3711 16.1138C9.87109 16.4024 9.24609 16.0416 9.24609 15.4642L9.24609 8.53603C9.24609 7.95868 9.87109 7.59784 10.3711 7.88651L16.3711 11.3506Z"
      fill="white"
    />
  </svg>
);

/**
 * **TBD:**
 * Implement a hover player that appears next to the paragraph when the user hovers over it.
 * The hover player should contain a play button that when clicked, should play the text of the paragraph.
 * This component makes use of the useHoveredParagraphCoordinate hook to get information about the hovered paragraph.
 */
export default function HoverPlayer() {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);
  const [selectedElement, setSelectedElement] = useState<HoveredElementInfo | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const elements = getTopLevelReadableElementsOnPage();
  const hoveredInfo = useHoveredParagraphCoordinate(elements as HTMLElement[]);

  useEffect(() => {
    if (selectedElement) {
      speechify(selectedElement.element);
    }
  }, [selectedElement])

  useEffect(() => {
    if (showPlayButton === false && hoveredInfo?.element && hoveredInfo !== hoveredElement) {
      console.log('show')
      if (showPlayButton === false) {
        setShowPlayButton(true);
      }
      if (hoveredInfo !== hoveredElement) {
        setHoveredElement(hoveredInfo)
      }
    } else {
      hideTimeout.current = setTimeout(() => {
        setShowPlayButton(false);
        setHoveredElement(null)
      }, 1000);
    }
    return () => clearTimeout(hideTimeout.current!);
  }, [showPlayButton, hoveredInfo, hoveredElement]);

  const onSelect = useCallback(() => {
    setSelectedElement(hoveredElement);
    // alert(`play sound for text: ${hoveredElement?.element.innerText.trim()}`)
  }, [hoveredElement])

  const style: CSSProperties = {
    position: "absolute",
    top: hoveredElement?.top,
    left: (hoveredElement?.left || 0) - 24,
    pointerEvents: "auto",
    zIndex: 700,
  };

  return (
    <>
      {hoveredElement && showPlayButton && (
        <div
          style={style}
          onMouseEnter={() => {
            clearTimeout(hideTimeout.current!);
          }}
          onClick={() => {
            onSelect()
          }}>
          <PlayButton />
        </div>
      )}
    </>
  );
}
