import React from 'react';
import Container, { Layout } from 'react-grid-layout';

import { findUpperSibling, findNearestSiblingToAppendAfter, hiddenElementExists } from './utils';

import './App.css';
import 'react-grid-layout/css/styles.css';


export interface IHiddenElement {
  element: Layout;
  upperSibling: string | undefined;
}


interface IState {
  minHeight: number;
  layout: Array<Layout>;
  hiddenElements: Array<IHiddenElement>;
}


const INITIAL_STATE: IState = {
  minHeight: 0,
  layout: [
    { i: '0', w: 1, h: 50, x: 0, y: 0 },
    { i: '1', w: 1, h: 100, x: 2, y: 1 },
    { i: '2', w: 3, h: 50, x: 0, y: 2 },
  ],
  hiddenElements: [],
};

export default class App extends React.PureComponent<{}, IState> {

  public state: IState = INITIAL_STATE;

  public render(): React.ReactNode {
    return (
      <div className="base">
        <label>Hidden Element Height (px)</label>
        <input id="hiddenHeight" type="number" defaultValue={this.state.minHeight} onChange={this.setMinHeight} />
        <button onClick={this.hideElements}>Toggle elements</button>
        <button data-index="1" onClick={this.toggleSingleElement}>Toggle 1</button>
        <button data-index="2" onClick={this.toggleSingleElement}>Toggle 2</button>

        <div className="layout">
          <Container
            width={600}
            margin={[0, 0]}
            draggableCancel=".non-draggable"
            isDraggable={true}
            isResizable={true}
            compactType="vertical"
            layout={this.state.layout}
            cols={3}
            rowHeight={1}
            onLayoutChange={this.onLayoutChange}
          >
            {this.mapLayoutItems()}
          </Container>
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

  private hideElements = (): void => {
    // this.setState({
    //   ...this.state,
    //   layout: this.state.layout.map(entry => {
    //     switch (entry.i) {
    //       case '1':
    //       case '2':
    //         return this.toggleElement(entry);
    //       default:
    //         return entry;
    //     }
    //   }),
    // });
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

    if (hiddenElementExists(index, this.state.hiddenElements)) {
      return this.restoreHiddenElement(index);
    }

    const element = this.state.layout.find(entry => entry.i === index);

    if (!element) {
      return;
    }
    

    this.pushToHiddenElements(element);

    // this.setState({
    //   layout: this.state.layout.map(entry => {
    //     switch (entry.i) {
    //       case index:
    //         return this.toggleElement(entry);
    //       default:
    //         return entry;
    //     }
    //   }),
    // });
  }

  private toggleElement(element: Layout): Layout {
    switch (element.maxH) {
      case void 0:
        const hiddenElement = {
          ...element,
          h: this.state.minHeight,
          maxH: element.h,
          minH: this.state.minHeight,
        };
        this.pushToHiddenElements(element);
        return hiddenElement;
      default:
        return {
          ...element,
          h: element.maxH,
          minH: element.maxH,
          maxH: void 0,
        }
    }
  }

  private pushToHiddenElements(element: Layout): void {
    const sibling = findUpperSibling(element, this.state.layout);
    const hiddenElement: IHiddenElement = {
      element,
      upperSibling: sibling?.i,
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
        layout: [element.element, ...this.state.layout],
        hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i === element.element.i),
      });
    }

    const appendAfterSibling = findNearestSiblingToAppendAfter(
      element.upperSibling,
      this.state.layout,
      this.state.hiddenElements,
    );
    console.log('Append sibling:', appendAfterSibling);
    if (appendAfterSibling === void 0) {
      return this.setState({
        ...this.state,
        layout: [{
          ...element.element,
          y: 0,
        },...this.state.layout],
        hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i !== element.element.i),
      });
    }

    /**
     * TODO:
     * 
     * Still needs to push down all the other elements underneath it
     */
    return this.setState({
      ...this.state,
      layout: [{
        ...element.element,
        y: appendAfterSibling.y + appendAfterSibling.h,
      },...this.state.layout],
      hiddenElements: this.state.hiddenElements.filter(entry => entry.element.i !== element.element.i),
    });
  }

  private onLayoutChange = (nextLayout: Array<Layout>): void => {
    this.setState({
      ...this.state,
      layout: nextLayout,
    });
  }
}
