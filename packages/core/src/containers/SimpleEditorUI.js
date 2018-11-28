import React from 'react';
import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import CollectionExplorer from '../components/CollectionExplorer/CollectionExplorer';
import EditableCanvas from '../components/EditableCanvas/EditableCanvas';
import MetadataEditor from '../components/MetadataEditor/MetadataEditor';
import TabPanel from '../components/TabPanel/TabPanel';

import './SimpleEditorUI.scss';

class SimpleEditorUI extends React.Component {
  render() {
    return (
      <div className="simple-manifest-editor">
        <div className="simple-manifest-editor__top-bar">
          Simple Manifest Editor
        </div>
        <div className="simple-manifest-editor__center">
          <div className="simple-manifest-editor__left-panel">
            <AnnotationList annotations={[]} />
          </div>
          <div className="simple-manifest-editor__canvas">
            <EditableCanvas />
          </div>
          <div className="simple-manifest-editor__right-panel">
            <TabPanel>
              <MetadataEditor />
              <CollectionExplorer />
            </TabPanel>
          </div>
        </div>
        <div className="simple-manifest-editor__bottom">
          <CanvasList canvases={[]} />
        </div>
      </div>
    );
  }
}

export default SimpleEditorUI;
