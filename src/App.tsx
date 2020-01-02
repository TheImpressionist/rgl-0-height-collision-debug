import React from 'react';
import Container, { Layout } from 'react-grid-layout';

import AnotherGrid from './NativeSolution';

import {
  findUpperSibling,
  findNearestSiblingToAppendAfter,
  findBottomSiblings,
  adjustBottomSiblings,
} from './utils';

import './App.css';
import 'react-grid-layout/css/styles.css';


export interface IBottomSiblings {
  i: string;
  x: number;
  y: number;
}

export interface IHiddenElement {
  element: Layout;
  upperSibling: string | undefined;
  upperSiblingPos?: {
    x: number;
    y: number;
  };
  bellowSiblings: Array<IBottomSiblings>;
}


interface IState {
  minHeight: number;
  layout: Array<Layout>;
  hiddenElements: Array<IHiddenElement>;
}


const INITIAL_STATE: IState = {
  minHeight: 0,
  layout: [
    { i: '0', w: 2, h: 50, x: 0, y: 0 },
    { i: '1', w: 2, h: 50, x: 2, y: 50 },
    { i: '2', w: 4, h: 50, x: 0, y: 150 },
    { i: '3', w: 2, h: 50, x: 2, y: 200 },
  ],
  hiddenElements: [],
};

export default class App extends React.PureComponent<{}, IState> {

  public state: IState = INITIAL_STATE;

  public render(): React.ReactNode {
    return (
      <div className="base">
        <h1>Custom solution</h1>
        <label>Hidden Element Height (px)</label>
        <input id="hiddenHeight" type="number" defaultValue={this.state.minHeight} onChange={this.setMinHeight} />
        <button data-index="1" onClick={this.toggleSingleElement}>Toggle 1</button>
        <button data-index="2" onClick={this.toggleSingleElement}>Toggle 2</button>
        <button data-index="3" onClick={this.toggleSingleElement}>Toggle 3</button>

        <div className="layout">
          <Container
            width={600}
            margin={[0, 0]}
            draggableCancel=".non-draggable"
            isDraggable={true}
            isResizable={true}
            compactType="vertical"
            layout={this.state.layout}
            cols={4}
            rowHeight={1}
            onDragStop={this.onDragStop}
            onLayoutChange={this.onLayoutChange}
          >
            {this.mapLayoutItems()}
          </Container>

          <br />
          <h1>Treating hidden elements as static but not removing from grid for performance</h1>

          <AnotherGrid />
        </div>
      </div>
    );
  }

  private mapLayoutItems(): Array<React.ReactNode> {
    return this.state.layout.map(entry => (
      <div key={entry.i} className={`item ${this.isHidden(entry) ? 'hidden' : ''}`}>
        {entry.i}
      </div>
    ));
  }

  private isHidden(element: Layout): boolean {
    return element.maxH !== void 0 && element.h === this.state.minHeight;
  }

  private setMinHeight = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      minHeight: Number(evt.target.value),
    });
  }

  private toggleSingleElement = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const index = evt.currentTarget.dataset.index;

    if (!index) {
      return;
    }

    return this.setState((state: IState) => {
      return {
        ...state,
        layout: state.layout.map(entry => {
          switch (entry.i) {
            case entry.i:
              return {
                ...entry,
                h: entry.h === 0 && entry.maxH !== void 0 ? entry.maxH : 0,
                maxH: entry.h === 0 && entry.maxH !== void 0 ? void 0 : entry.h,
              };
            default:
              return entry;
          }
        }),
      };
    }, () => console.log('Your state:', this.state));
    // if (hiddenElementExists(index, this.state.hiddenElements)) {
    //   return this.restoreHiddenElement(index);
    // }

    // const element = this.state.layout.find(entry => entry.i === index);

    // if (!element) {
    //   return;
    // }
    
    // this.pushToHiddenElements(element);
  }

  private pushToHiddenElements(element: Layout): void {
    const sibling = findUpperSibling(element, this.state.layout);
    const hiddenElement: IHiddenElement = {
      element,
      upperSibling: sibling?.i,
      upperSiblingPos: sibling
        ? { x: sibling.x, y: sibling.y }
        : void 0,
      bellowSiblings: findBottomSiblings(element, this.state.layout),
    };

    this.setState({
      ...this.state,
      layout: this.state.layout.filter(entry => entry.i !== element.i),
      hiddenElements: [...this.state.hiddenElements, hiddenElement],
    });
  }

  private restoreHiddenElement(index: string): void {
    const element = this.state.hiddenElements.find(entry => entry.element.i === index);

    if (!element) {
      return;
    }

    if (!element.upperSibling) {
      return this.setState({
        ...this.state,
        layout: adjustBottomSiblings(
          element.element,
          element.bellowSiblings,
          [{
            ...element.element,
            y: 0,
          }, ...this.state.layout],
        ),
        // layout: [{
        //   ...element.element,
        //   y: 0,
        // }, ...this.state.layout],
        hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i !== element.element.i),
      });
    }

    const appendAfterSibling = findNearestSiblingToAppendAfter(
      element.upperSibling,
      this.state.layout,
      this.state.hiddenElements,
    );

    if (appendAfterSibling === void 0) {
      return this.setState({
        ...this.state,
        layout: adjustBottomSiblings(
          element.element,
          element.bellowSiblings,
          [{
            ...element.element,
            y: 0,
          }, ...this.state.layout],
        ),
        // layout: [{
        //   ...element.element,
        //   y: 0,
        // },...this.state.layout],
        hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i !== element.element.i),
      });
    }

    return this.setState({
      ...this.state,
      layout: adjustBottomSiblings(
        element.element,
        element.bellowSiblings,
        [{
          ...element.element,
          y: appendAfterSibling.y + appendAfterSibling.h,
        }, ...this.state.layout],
      ),
      // layout: [{
      //   ...element.element,
      //   y: appendAfterSibling.y + appendAfterSibling.h,
      // },...this.state.layout],
      hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i !== element.element.i),
    });
  }

  private onDragStop = (_: Array<Layout>, __: Layout, item: Layout): void => {

  }

  private onLayoutChange = (nextLayout: Array<Layout>): void => {
    // This should only be used to normalize the layout, and not to control changes
    // Because this way it's hard to track which element actually moved
    // Unless we capture that element through onDragStop
    // That way we can determine here whether to do any sibling updates or not?

    this.setState({
      ...this.state,
      layout: nextLayout,
      // hiddenElements: this.updateHiddenElementSiblings(nextLayout),
    });
  }

  private updateHiddenElementSiblings(nextLayout: Array<Layout>): Array<IHiddenElement> {
    return this.state.hiddenElements.map(entry => ({
      ...entry,
      bellowSiblings: findBottomSiblings(entry.element, this.state.layout)
    }));
  }
}
