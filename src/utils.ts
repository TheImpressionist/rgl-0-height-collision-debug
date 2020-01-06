
import { Layout } from 'react-grid-layout';
import { IHiddenElement, IBottomSiblings } from './App';





export function findUpperSibling(element: Layout, elements: Array<Layout>): Layout | undefined {
  return elements
    .sort((a, b) => a >= b ? -1 : 1)
    .find((entry) => entry.y + entry.h === element.y);
}


export function intersectsXAxis(x0: number, x1: number, x2: number, x3: number): boolean {
  // Old collision check
  // (x3 >= x0 && x3 <= x1) ||
  // (x2 >= x0 && x2 <= x1) ||
  // (x0 >= x2 && x0 <= x3 && x1 >= x2 && x1 <= x3) ||
  // (x2 >= x0 && x2 <= x1 && x3 >= x0 && x3 <= x1)
  return (x2 >= x0 && x2 < x1) || (x3 > x0 && x3 <= x1);
}


export function findBottomSiblings(element: Layout, elements: Array<Layout>): Array<IBottomSiblings> {
  const x0 = element.x;
  const x1 = element.x + element.w;
  // ? -1 : 1
  const sorted = elements.sort((a, b) => {
    switch (true) {
      case a.y > b.y:
        return 1;
      case a.y < b.y:
        return -1;
      default:
        return 0;
    }
  });
  const siblings = sorted.filter((entry, index, arr) => {
    const x2 = entry.x;
    const x3 = entry.x + entry.w;
    const h = element.h === 0 && element.maxH !== void 0 ? element.maxH : element.h;
    const intersects = element.i !== entry.i && element.y + h === entry.y && intersectsXAxis(x0, x1, x2, x3);

    // Backwards lookup to see if the element is above it but not touching
    // Meaning there's an empty space between the elements but potentially they could touch
    if (!intersects) {
      for (let i = index - 1; i > 0; i--) {
        // It is touching another element, so we ignore it.
        if (arr[i].y + arr[i].h === entry.y && intersectsXAxis(x0, x1, arr[i].x, arr[i].x + arr[i].w)) {
          return false;
        }

        // We reached the current element that we are checking against
        // Meaning we have an empty space between the reference element and the current element
        // We consider as if they were touching. This accounts for any X-axis siblings making the elements ignore each because of an empty space.
        // Long distance relationship, basically.
        if (arr[i].i === element.i && intersectsXAxis(x0, x1, x2, x3)) {
          return true;
        }
      }

      return intersects;
    }

    return intersects;
  });

  /**
   * NOTE:
   * 
   * The above code is partially correct.
   * What needs to be done is that I need to find all next potential siblings.
   * But not the ones after the found siblings.
   */

  if (!siblings.length) {
    let firstFoundSibling: Layout;

    return sorted.filter(entry => {
      const x2 = entry.x;
      const x3 = entry.x + entry.w;

      if (!firstFoundSibling) {
        const intersects = entry.i !== element.i && entry.y >= element.y + element.h && intersectsXAxis(x0, x1, x2, x3);

        if (intersects) {
          firstFoundSibling = entry;
        }

        return intersects;
      }

      return entry.i !== element.i && entry.y === firstFoundSibling.y && intersectsXAxis(x0, x1, x2, x3);
    });
  }

  return siblings.map(entry => ({
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