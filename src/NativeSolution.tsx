
import React from 'react';
import Container, { Layout } from 'react-grid-layout';



export interface IState {
  layout: Array<Layout>;
  hiddenElements: Array<string>;
}


const INITIAL_STATE: IState = {
  layout: [
    { i: '0', w: 2, h: 50, x: 0, y: 0 },
    { i: '1', w: 2, h: 50, x: 2, y: 50 },
    { i: '2', w: 4, h: 50, x: 0, y: 150 },
    { i: '3', w: 2, h: 50, x: 2, y: 200 },
  ],
  hiddenElements: [],
};


export default class CSSBasedGrid extends React.PureComponent<{}, IState> {
  
  public state: IState = INITIAL_STATE;

  public render(): React.ReactNode {
    return (
      <div className="base">
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
      <div key={entry.i} className={`item ${entry.hidden ? 'hidden' : ''}`}>
        {entry.i}
      </div>
    ));
  }


  private toggleSingleElement = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.currentTarget;

    if (!target.dataset.index) {
      return;
    }

    return this.setState((state: IState) => {
      return {
        ...state,
        layout: state.layout.map(entry => {
          switch (target.dataset.index) {
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
  }

  private onLayoutChange = (nextLayout: Array<Layout>): void => {
    this.setState({
      ...this.state,
      layout: nextLayout,
    });
  }
}
