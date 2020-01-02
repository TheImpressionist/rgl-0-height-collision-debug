
import React from 'react';
import Container, { Layout } from 'react-grid-layout';

import { LayoutUpdateSource } from './Enums';


export interface IProps {
  layout: Array<Layout>;
  toggleElement(index: string): void;
  onLayoutChange(nextLayout: Array<Layout>, source: LayoutUpdateSource): void;
}



export default class View extends React.PureComponent<IProps, {}> {

  public render(): React.ReactNode {
    return (
      <div className="view">
        <h1>View</h1>

        {this.mapButtons()}

        <Container
          width={600}
          margin={[0, 0]}
          draggableCancel=".non-draggable"
          isDraggable={false}
          isResizable={false}
          verticalCompact={true}
          compactType="vertical"
          layout={this.props.layout}
          cols={4}
          rowHeight={1}
          onLayoutChange={this.changeInterceptor}
        >
          {this.mapItems()}
        </Container>
      </div>
    );
  }

  private mapButtons(): Array<React.ReactNode> {
    return this.props.layout.map(entry => (
      <button data-index={entry.i} onClick={this.toggleSingleElement}>Toggle {entry.i}</button>
    ))
  }

  private mapItems(): Array<React.ReactNode> {
    return this.props.layout.map(entry => (
      <div key={entry.i} className={`item ${this.isHidden(entry) ? 'hidden' : ''}`}>
        {entry.i}
      </div>
    ));
  }

  private isHidden(element: Layout): boolean {
    return element.maxH !== void 0 && element.h === 0;
  }

  private toggleSingleElement = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const index = evt.currentTarget.dataset.index;

    if (!index) {
      return;
    }
    
    this.props.toggleElement(index);
  }

  private changeInterceptor = (nextLayout: Array<Layout>): void => {
    this.props.onLayoutChange(nextLayout, LayoutUpdateSource.View);
  }
}
