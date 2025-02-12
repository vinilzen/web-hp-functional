import { useEffect, useState } from "react";

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
  // Determine the target element that contains the first line of text.
  let target: HTMLElement = element;
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
      target = element;
      break;
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.textContent && node.textContent.trim().length > 0) {
      target = node as HTMLElement;
      break;
    }
  }

  const realStyle = window.getComputedStyle(target);
  const fontSize = Number.parseFloat(realStyle.fontSize);
  const lineHeight = realStyle.lineHeight;

  if (lineHeight === 'normal') {
    return fontSize * 1.2;
  }

  if (lineHeight.includes('px')) {
    return Number.parseFloat(lineHeight);
  }

  const numericLineHeight = Number.parseFloat(lineHeight);
  if (numericLineHeight === 1) {
    return fontSize;
  }
  return fontSize * numericLineHeight;
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
    if (parsedElements.length !== 0) {
      const eventListener = ({ clientX, clientY }: MouseEvent) => {
        let hovered = null;
        for (const element of parsedElements) {
          const inside = isPointInsideElement({ x: clientX, y: clientY }, element)
          if (inside) {
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

  if (parsedElements.length === 0 || hoveredElement === null) {
    return null;
  }

  return {
    element: hoveredElement,
    ...getElementBounds(hoveredElement),
    heightOfFirstLine: getLineHeightOfFirstLine(hoveredElement)
  }
}
