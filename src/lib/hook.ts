import { useEffect, useMemo, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  if (element) {
    const rectangle = getElementBounds(element);
    const isInside =
      coordinate.x >= rectangle.x &&
      coordinate.x <= (rectangle.x + rectangle.width) &&
      coordinate.y >= rectangle.top &&
      coordinate.y <= (rectangle.top + rectangle.height);

    return isInside;
  }
  return false;
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (parsedElements.length === 0) {
      const eventListener = ({ clientX, clientY }: MouseEvent) => {
        let hovered = null;
        for (const element of parsedElements) {
          const inside = isPointInsideElement({ x: clientX, y: clientY }, element)
          if (inside) {
            console.log(element.tagName, inside)
            hovered = element;
          }
        }
        setHoveredElement(hovered);
      }

      window.addEventListener('mousemove', eventListener)

      return () => {
        window.removeEventListener('mousemove', eventListener)
      }
    }
  }, [parsedElements]);

  const elementCoordinates = useMemo(() => {
    if (hoveredElement) {
      const coord = getElementBounds(hoveredElement);
      return { top: coord.top, left: coord.left };
    }
    return { top: 0, left: 0 };
  }, [hoveredElement])

  if (parsedElements.length === 0 || hoveredElement === null) {
    return null;
  }

  return {
    element: hoveredElement,
    left: elementCoordinates?.left || 0,
    top: elementCoordinates?.top || 0,
    heightOfFirstLine: 1
  }
}
