
import { Layout } from 'react-grid-layout';
import { IHiddenElement } from './App';





export function findUpperSibling(element: Layout, elements: Array<Layout>): Layout | undefined {
  return elements
    .sort((a, b) => a >= b ? -1 : 1)
    .find((entry) => entry.y + entry.h === element.y);
}


export function elementExists(index: string, elements: Array<Layout>): boolean {
  return elements.findIndex(entry => entry.i === index) !== -1;
}


export function hiddenElementExists(index: string, hiddenElements: Array<IHiddenElement>): boolean {
  return hiddenElements.findIndex(entry => entry.element.i === index) !== -1;
}


export function findXAxisSiblings(element: Layout, elements: Array<Layout>): Array<Layout> {
  return elements.filter(entry => (
    ((element.y >= entry.y && element.y + element.h >= entry.y) ||
    (element.y <= entry.y + entry.h && element.y <= entry.y )) &&
    ((element.x <= entry.x && element.x + element.w <= entry.x + entry.w) ||
    (entry.x <= element.x && entry.x + entry.w <= element.x + element.w))
  ));
}


export function findNearestSiblingToAppendAfter(siblingIndex: string, elements: Array<Layout>, hiddenElements: Array<IHiddenElement>): Layout | undefined {
  if (hiddenElementExists(siblingIndex, hiddenElements)) {
    const hiddenElement = hiddenElements.find(element => element.element.i === siblingIndex);

    // If no element was found, it should check whether the position where the old hidden element used to be had
    // any siblings on the X axis and check whether this element could potentially collide with those elements.
    // If there are any collisions, find the first collision that has the heighest Y + H along the Y axis and return it as the append index

    if (hiddenElement && !hiddenElement.upperSibling) {
      // Should sort by by highest y + h in a descending manner
      // TODO: Check whether the X axis sibling actually collides, just filter those that do not collide out
      const xAxisSiblings = findXAxisSiblings(hiddenElement.element, elements)
        .sort((a, b) => {
          return a.y + a.h >= b.y + b.h ? -1 : 1;
        });

      if (xAxisSiblings.length === 0) {
        return void 0;
      }
      
      return xAxisSiblings[xAxisSiblings.length - 1];
    }

    if (!hiddenElement) {
      return void 0;
    }

    return findNearestSiblingToAppendAfter(hiddenElement.upperSibling as string, elements, hiddenElements);
  }

  const element = elements.find(entry => entry.i === siblingIndex);

  if (!element) {
    return void 0;
  }

  return element;
}