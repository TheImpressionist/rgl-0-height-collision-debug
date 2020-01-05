
import React from 'react';
import { Layout } from 'react-grid-layout';

import Editor from './EditorView';
import View from './FinalView';
import { findBottomSiblings } from '../utils';

import './Style.css';
import 'react-grid-layout/css/styles.css';
import { LayoutUpdateSource } from './Enums';


export interface IHiddenElement {
  i: string;
  bottomSiblings: Array<string>;
}


interface IState {
  layout: Array<Layout>;
  hiddenElements: Array<IHiddenElement>;
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
    }

    this.setState((state: IState) => {
      return {
        ...state,
        layout,
        hiddenElements: source === LayoutUpdateSource.Editor ? this.buildHiddenElementState(layout) : state.hiddenElements,
      };
    });
  }

  private buildHiddenElementState(layout: Array<Layout>): Array<IHiddenElement> {
    const hiddenElements: Array<IHiddenElement> = [];

    for (const element of layout) {
      if (element.maxH !== void 0) {
        hiddenElements.push({
          i: element.i,
          bottomSiblings: findBottomSiblings(element, layout).map(entry => entry.i),
        });
      }
    }

    return hiddenElements
  }

  private buildLayoutYSiblingMap(layout: Array<Layout>): void {
    for (const element of layout) {
      this.layoutYSiblingMap[element.i] = findBottomSiblings(element, layout).map(entry => entry.i);
    }

    console.log('Built Y Sibling map:', this.layoutYSiblingMap);
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
        hiddenElements: !element ? state.hiddenElements : [...state.hiddenElements, {
          i: element.i,
          bottomSiblings: findBottomSiblings(element, state.layout).map(entry => entry.i),
        }],
      };
    });
  }

  private showElement(index: string): void {
    const hiddenElement = this.state.hiddenElements.find(entry => entry.i === index);

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
        layout: this.normalizePositions(nextLayout),
        hiddenElements: state.hiddenElements.filter(entry => entry.i !== hiddenElement.i),
      };
    }, () => console.log('Next state:', this.state));
  }

  private normalizePositions(layout: Array<Layout>): Array<Layout> {
    const keys = Object.keys(this.layoutYSiblingMap);
    let nextLayout = [...layout];

    for (const key of keys) {
      const element = nextLayout.find(entry => entry.i === key);

      if (!element || element.static) {
        continue;
      }

      nextLayout = this.mapElementSiblingPositions(element, nextLayout);
    }
    console.log('Mapped new layout:', JSON.parse(JSON.stringify(nextLayout)));
    return nextLayout;
  }

  private mapElementSiblingPositions(element: Layout, layout: Array<Layout>, forceY?: number): Array<Layout> {
    let nextLayout = [...layout];
    const siblings = this.layoutYSiblingMap[element.i];

    for (let i = 0, ii = nextLayout.length; i < ii; i++) {
      const entry = nextLayout[i];
      const isSibling = siblings.includes(entry.i);

      if (!isSibling) {
        continue;
      }

      // If the element is hidden we adjust its siblings instead to account for new positions related to itself.
      // That's because all the siblings bellow the hidden sibling should adhere to the current element's position.
      if (entry.static) {
        const mappedLayout = this.mapElementSiblingPositions(entry, nextLayout, forceY !== void 0 ? forceY : element.y + element.h);

        nextLayout = nextLayout.map(nEntry => {
          const mappedElement = mappedLayout.find(mappedEntry => mappedEntry.i === nEntry.i);

          if (!mappedElement) {
            return nEntry;
          }

          return mappedElement;
        });
      }

      // entry.y !== element.y + element.h
      if (forceY === void 0) {
        nextLayout[i] = {
          ...entry,
          y: element.y + element.h,
        };
      }

      if (forceY !== void 0 && forceY >= nextLayout[i].y) {
        nextLayout[i] = {
          ...entry,
          y: forceY,
        };
      }
    }

    return nextLayout;
  }
}