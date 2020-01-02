
import { Layout } from 'react-grid-layout';
import { IHiddenElement, IBottomSiblings } from './App';





export function findUpperSibling(element: Layout, elements: Array<Layout>): Layout | undefined {
  return elements
    .sort((a, b) => a >= b ? -1 : 1)
    .find((entry) => entry.y + entry.h === element.y);
}


export function findBottomSiblings(element: Layout, elements: Array<Layout>): Array<IBottomSiblings> {
  return elements
    .sort((a, b) => a >= b ? -1 : 1)
    .filter(entry => element.i !== entry.i && element.y + element.h === entry.y)
    .map(entry => ({
      i: entry.i,
      x: entry.x,
      y: entry.y,
    }));
}


export function elementExists(index: string, elements: Array<Layout>): boolean {
  return elements.findIndex(entry => entry.i === index) !== -1;
}


export function hiddenElementExists(index: string, hiddenElements: Array<IHiddenElement>): boolean {
  return hiddenElements.findIndex(entry => entry.element.i === index) !== -1;
}


export function findXAxisCollisions(element: Layout, elements: Array<Layout>): Array<Layout> {
  const x2 = element.x;
  const x3 = element.x + element.w;

  return elements.filter(entry => {
    const x0 = entry.x;
    const x1 = entry.x + entry.w;

    return (
      (
        (element.y >= entry.y && element.y + element.h >= entry.y) ||
        (element.y <= entry.y + entry.h && element.y <= entry.y )
      ) &&
      (
        (x3 >= x0 && x3 <= x1) ||
        (x2 >= x0 && x2 <= x1) ||
        (x0 >= x2 && x0 <= x3 && x1 >= x2 && x1 <= x3) ||
        (x2 >= x0 && x2 <= x1 && x3 >= x0 && x3 <= x1)
      )
    );
  });
}


// export function findCollisions(element: string, elements: Array<Layout>): Array<Layout> {
//   return elements
//     .sort((a, b) => a >= b ? -1 : 1)
//     .filter(entry => (

//     ));
// }


export function findNearestSiblingToAppendAfter(siblingIndex: string, elements: Array<Layout>, hiddenElements: Array<IHiddenElement>): Layout | undefined {
  if (hiddenElementExists(siblingIndex, hiddenElements)) {
    const hiddenElement = hiddenElements.find(element => element.element.i === siblingIndex);
    // If no element was found, it should check whether the position where the old hidden element used to be had
    // any siblings on the X axis and check whether this element could potentially collide with those elements.
    // If there are any collisions, find the first collision that has the heighest Y + H along the Y axis and return it as the append index

    if (hiddenElement && !hiddenElement.upperSibling) {
      // Should sort by by highest y + h in a descending manner
      // TODO: Check whether the X axis sibling actually collides, just filter those that do not collide out
      const xAxisSiblings = findXAxisCollisions(hiddenElement.element, elements)
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

export function pushDownElements(element: Layout, elements: Array<Layout>): Array<Layout> {
  const collisions = findXAxisCollisions(element, elements);
  
  if (collisions.length === 0) {
    return elements;
  }

  const nextLayout = elements.map(entry => {
    if (entry.i === element.i) {
      return entry;
    }

    const colliding = collisions.find(potentialCollision => potentialCollision.i === entry.i);

    switch (true) {
      case colliding !== void 0 && colliding.i === entry.i:
        return {
          ...entry,
          y: element.y + element.h,
        };
      default:
        return entry;
    }
  });

  return nextLayout;
  // return pushDownElements(collisions[])
}


export function addElementAtPosition(pos: number, element: Layout, elements: Array<Layout>): Array<Layout> {
  const nextLayout = [{
    ...element,
    y: pos,
  }, ...elements];

  return pushDownElements(element, nextLayout);
}


export function adjustBottomSiblings(element: Layout, siblings: Array<IBottomSiblings>, elements: Array<Layout>): Array<Layout> {
  return elements.map(entry => {
    if (element.i === entry.i) {
      return entry;
    }

    const isSibling = siblings.find(sibling => sibling.i === entry.i) !== void 0;

    switch (isSibling) {
      case true:
        return {
          ...entry,
          y: element.y + element.h,
        };
      default:
        return entry;
    }
  });
}