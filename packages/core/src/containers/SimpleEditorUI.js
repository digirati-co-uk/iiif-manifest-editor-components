import React from 'react';
import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import CollectionExplorer from '../components/CollectionExplorer/CollectionExplorer';
import EditableCanvas from '../components/EditableCanvas/EditableCanvas';
import MetadataEditor from '../components/MetadataEditor/MetadataEditor';
import TabPanel from '../components/TabPanel/TabPanel';
import { queryResourceById } from '../utils/IIIFResource';

import './SimpleEditorUI.scss';

class SimpleEditorUI extends React.Component {
  state = {
    rootResource: null,
    selectedIdsByType: {
      Canvas: null,
      Annotation: null,
    },
  };

  render() {
    const canvases = this.state.rootResource
      ? this.state.rootResource.items
      : [];
    const selectedCanvas = queryResourceById(
      this.state.selectedIdsByType.Canvas,
      this.state.rootResource
    );
    const annotations =
      selectedCanvas.items && selectedCanvas.items.length > 0
        ? selectedCanvas.items[0].items || null
        : null;
    const selectedAnnotation = queryResourceById(
      this.state.selectedIdsByType.Annotation,
      selectedCanvas
    );
    return (
      <div className="simple-manifest-editor">
        <div className="simple-manifest-editor__top-bar">
          Simple Manifest Editor
        </div>
        <div className="simple-manifest-editor__center">
          <div className="simple-manifest-editor__left-panel">
            <AnnotationList annotations={annotations} />
          </div>
          <div className="simple-manifest-editor__canvas">
            <EditableCanvas />
          </div>
          <div className="simple-manifest-editor__right-panel">
            <TabPanel>
              <MetadataEditor
                manifest={this.state.rootResource}
                canvas={selectedCanvas}
                annotation={selectedAnnotation}
              />
              <CollectionExplorer />
            </TabPanel>
          </div>
        </div>
        <div className="simple-manifest-editor__bottom">
          <CanvasList canvases={canvases} />
        </div>
      </div>
    );
  }
}

export default SimpleEditorUI;
