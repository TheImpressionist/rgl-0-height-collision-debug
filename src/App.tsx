import React from 'react';
import Container, { Layout } from 'react-grid-layout';


import './App.css';
import 'react-grid-layout/css/styles.css';


interface IState {
  minHeight: number;
  layout: Array<Layout>;
}


const INITIAL_STATE: IState = {
  minHeight: 0,
  layout: [
    { i: '0', w: 2, h: 50, x: 0, y: 0, minH: 50 },
    { i: '1', w: 2, h: 50, x: 0, y: 50, minH: 50 },
    { i: '2', w: 2, h: 50, x: 0, y: 100, minH: 50 },
  ],
};

const HIDDEN_HEIGHT = 0;


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
            cols={2}
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
    this.setState({
      ...this.state,
      layout: this.state.layout.map(entry => {
        switch (entry.i) {
          case '1':
          case '2':
            return this.toggleElement(entry);
          default:
            return entry;
        }
      }),
    });
  }

  private setMinHeight = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      minHeight: Number(evt.target.value),
    });
  }

  private toggleSingleElement = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const index = evt.currentTarget.dataset.index;

    this.setState({
      layout: this.state.layout.map(entry => {
        switch (entry.i) {
          case index:
            return this.toggleElement(entry);
          default:
            return entry;
        }
      }),
    });
  }

  private toggleElement(element: Layout): Layout {
    switch (element.maxH) {
      case void 0:
        return {
          ...element,
          h: this.state.minHeight,
          maxH: element.h,
          minH: this.state.minHeight,
        };
      default:
        return {
          ...element,
          h: element.maxH,
          minH: element.maxH,
          maxH: void 0,
        }
    }
  }

  private onLayoutChange = (nextLayout: Array<Layout>): void => {
    this.setState({
      ...this.state,
      layout: nextLayout,
    });
  }
}
