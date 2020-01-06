
import React from 'react';
import { Layout } from 'react-grid-layout';

import Editor from './EditorView';
import View from './FinalView';
import { findBottomSiblings } from '../utils';

import './Style.css';
import 'react-grid-layout/css/styles.css';
import { LayoutUpdateSource } from './Enums';




interface IState {
  layout: Array<Layout>;
  hiddenElements: Array<string>;
}


export default class App extends React.PureComponent<{}, IState> {

  public state: IState = {
    layout: [],
    hiddenElements: [],
  }

  private layoutYSiblingMap: Record<string, Array<string>> = {};

  public render(): React.ReactNode {
    return (
      <div className="base">
        <Editor setLayout={this.setLayout} />
        <View layout={this.state.layout} toggleElement={this.toggleElement} onLayoutChange={this.setLayout} />
      </div>
    );
  }

  private setLayout = (layout: Array<Layout>, source: LayoutUpdateSource): void => {
    if (source === LayoutUpdateSource.Editor) {
      this.buildLayoutYSiblingMap(layout);
      console.log('Built map:', this.layoutYSiblingMap);
    }

    this.setState((state: IState) => {
      return {
        ...state,
        layout,
        hiddenElements: source === LayoutUpdateSource.Editor ? this.buildHiddenElementState(layout) : state.hiddenElements,
      };
    });
  }

  private buildHiddenElementState(layout: Array<Layout>): Array<string> {
    return layout
      .filter(entry => entry.maxH !== void 0)
      .map(entry => entry.i);
  }

  private buildLayoutYSiblingMap(layout: Array<Layout>): void {
    for (const element of layout) {
      this.layoutYSiblingMap[element.i] = findBottomSiblings(element, layout).map(entry => entry.i);
    }
  }

  private toggleElement = (index: string): void => {
    const element = this.state.layout.find(entry => entry.i === index);

    if (!element) {
      return;
    }

    switch (true) {
      case element.i === index && element.maxH === void 0 && element.h !== 0:
        return this.hideElement(index);
      case element.i === index && element.maxH !== void 0 && element.h === 0:
        return this.showElement(index);
      default:
        return;
    }
  }

  private hideElement(index: string): void {
    this.setState((state: IState) => {
      const element = state.layout.find(entry => entry.i === index);

      return {
        ...state,
        layout: state.layout.map(entry => {
          switch (entry.i) {
            case index:
              return {
                ...entry,
                w: 0,
                h: 0,
                maxH: entry.h,
                maxW: entry.w,
                static: true,
              };
            default:
              return entry;
          }
        }),
        hiddenElements: !element ? state.hiddenElements : [...state.hiddenElements, element.i],
      };
    });
  }

  private showElement(index: string): void {
    const hiddenElement = this.state.hiddenElements.find(entry => entry === index);

    if (!hiddenElement) {
      return;
    }

    this.setState((state: IState) => {
      const nextLayout = state.layout
        .map(entry => {
          switch (entry.i) {
            case index:
              return {
                ...entry,
                w: entry.maxW as number,
                h: entry.maxH as number,
                maxW: void 0,
                maxH: void 0,
                static: false,
              };
            default:
              return entry;
          }
        });

      return {
        ...state,
        layout: this.normalizePositions(index, nextLayout),
        hiddenElements: state.hiddenElements.filter(entry => entry !== hiddenElement),
      };
    });
  }

  /**
   * Normalizes positions so they would follow the correct order as on init.
   * 
   * @param elementIndex Index of an element that got triggered to be shown
   * @param layout       Layout upon which the action takes place
   */
  private normalizePositions(elementIndex: string, layout: Array<Layout>): Array<Layout> {
    const element = layout.find(entry => entry.i === elementIndex);
    const siblings = this.layoutYSiblingMap[elementIndex];

    if (!element || !siblings || !siblings.length) {
      return layout;
    }

    return this.mapSiblingPositions(element, siblings, layout);
  }

  /**
   * Sifts through siblings recursively to update the layout with correct layout positions.
   * 
   * @param element  Element that serves as a reference point which other elements should follow
   * @param siblings Siblings of the element
   * @param layout   Layout upon which the action takes place
   */
  private mapSiblingPositions(element: Layout, siblings: Array<string>, layout: Array<Layout>): Array<Layout> {
    let nextLayout = [...layout];

    for (let i = 0, ii = nextLayout.length; i < ii; i++) {
      // eslint-disable-next-line
      const sibling = siblings.find(entry => entry === nextLayout[i].i);

      if (!sibling) {
        continue;
      }

      /**
       * This case denotes that the sibling is hidden.
       * In this case we pass the sibling's siblings recursively with the current element being as its
       * reference point which the other siblings should follow.
       */
      if (nextLayout[i].static) {
        // Sibling's siblings
        const deepSiblings = this.layoutYSiblingMap[sibling];

        if (!deepSiblings || !deepSiblings.length) {
          continue;
        }

        const mappedDeepSiblings = this.mapSiblingPositions(element, deepSiblings, layout);

        for (const mappedSibling of mappedDeepSiblings) {
          // If it's not the adjust sibling we just move along
          if (!deepSiblings.includes(mappedSibling.i)) {
            continue;
          }

          const index = nextLayout.findIndex(entry => entry.i === mappedSibling.i);

          // Saftey just in case, could be a bit over the top, but otherwise TypeScript will scream bloody murder at you
          if (index === -1) {
            continue;
          }

          // Assigned the newly mapped sibling to the current layout
          nextLayout[index] = mappedSibling;
        }
      }

      if (element.y + element.h > nextLayout[i].y) {
        // Push the sibling down bellow the reference element
        nextLayout[i] = {
          ...nextLayout[i],
          y: element.y + element.h,
        };
      }
    }

    // Now update sibling's siblings
    for (const sibling of siblings) {
      const element = nextLayout.find(entry => entry.i === sibling);
      const deepSiblings = this.layoutYSiblingMap[sibling];

      if (!element || !deepSiblings || !deepSiblings.length) {
        continue;
      }

      nextLayout = this.mapSiblingPositions(element, deepSiblings, nextLayout);
    }

    return nextLayout;
  }
}