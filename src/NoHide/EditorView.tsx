
import React from 'react';
import Container, { Layout } from 'react-grid-layout';
import { LayoutUpdateSource } from './Enums';


export interface IProps {
  setLayout(layout: Array<Layout>, source: LayoutUpdateSource): void;
}


export interface IState {
  layout: Array<Layout>;
}


const INITIAL_STATE: IState = {
  layout: [
    { i: '0', w: 2, h: 50, x: 0, y: 0, minH: 0 },
    { i: '1', w: 2, h: 50, x: 2, y: 0, minH: 0 },
    { i: '2', w: 4, h: 50, x: 0, y: 50, minH: 0 },
    { i: '3', w: 2, h: 50, x: 0, y: 100, minH: 0 },
    { i: '4', w: 2, h: 50, x: 2, y: 100, minH: 0 },
    { i: '5', w: 2, h: 50, x: 0, y: 150, minH: 0 },
    { i: '6', w: 2, h: 50, x: 2, y: 150, minH: 0 },
    { i: '7', w: 2, h: 50, x: 0, y: 200, minH: 0 },
    { i: '8', w: 2, h: 50, x: 2, y: 200, minH: 0 },
    { i: '9', w: 2, h: 50, x: 0, y: 250, minH: 0 },
    { i: '10', w: 2, h: 50, x: 2, y: 250, minH: 0 },
    { i: '11', w: 2, h: 50, x: 0, y: 300, minH: 0 },
    { i: '12', w: 2, h: 50, x: 2, y: 300, minH: 0 },
    { i: '13', w: 2, h: 50, x: 0, y: 350, minH: 0 },
    { i: '14', w: 2, h: 50, x: 2, y: 350, minH: 0 },
    { i: '15', w: 2, h: 50, x: 0, y: 400, minH: 0 },
    { i: '16', w: 2, h: 50, x: 2, y: 400, minH: 0 },
    { i: '17', w: 2, h: 50, x: 0, y: 450, minH: 0 },
    { i: '18', w: 2, h: 50, x: 2, y: 450, minH: 0 },
    { i: '19', w: 2, h: 50, x: 0, y: 500, minH: 0 },
    { i: '20', w: 2, h: 50, x: 2, y: 500, minH: 0 },
  ],
};


export default class EditorView extends React.PureComponent<IProps, IState> {

  public state: IState = { ...INITIAL_STATE };

  public render(): React.ReactNode {
    return (
      <div className="editor">
        <h1>Editor</h1>

        <div className="main-action">
          <button className="save" onClick={this.commitLayout}>Save Layout</button>
        </div>
        {this.mapButtons()}

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
          {this.mapItems()}
        </Container>
      </div>
    );
  }

  private mapButtons(): Array<React.ReactNode> {
    return this.state.layout.map(entry => (
      <button data-index={entry.i} onClick={this.toggleSingleElement}>Toggle {entry.i}</button>
    ))
  }

  private mapItems(): Array<React.ReactNode> {
    return this.state.layout.map(entry => (
      <div key={entry.i} className={`item ${this.isHidden(entry) ? 'hidden' : ''}`}>
        {entry.i}
      </div>
    ));
  }

  private isHidden(element: Layout): boolean {
    return element.maxH !== void 0;
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
            case index:
              return {
                ...entry,
                maxH: entry.maxH !== void 0 ? void 0 : entry.h,
              };
            default:
              return entry;
          }
        })
      };
    });
  }

  private onLayoutChange = (nextLayout: Array<Layout>): void => {
    this.setState((state: IState) => {
      return {
        ...state,
        layout: nextLayout,
      };
    });
  }

  private commitLayout = (): void => {
    this.props.setLayout(this.state.layout.map(entry => {
      switch (true) {
        case entry.maxH !== void 0:
          return {
            ...entry,
            h: 0,
          };
        default:
          return entry;
      }
    }), LayoutUpdateSource.Editor);
  }
}
