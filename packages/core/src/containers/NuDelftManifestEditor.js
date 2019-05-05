import React from 'react';
import * as classnames from 'classnames';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import {
  LibraryAdd,
  SaveAlt,
  Visibility,
  GridOn,
  GridOff,
  Input,
} from '@material-ui/icons';

// import ExhibitionPreview from '../components/ExhibitionPreview';
// import ExhibitionCanvasWidthHeight from '../components/ExhibitionCanvasWidthHeight';
// import {
//   AppBarButton,
//   TabPanel,
//   AnnotationList,
//   EditableCanvasPanel,
//   AnnotationList,
//   CanvasList
//   TextPainting,
//   TextLayoutViewFocus,
//   ImagePainting,
//   VideoPainting,
// } from '@iiif-mec/core';
import AppBarButton from '../components/AppBarButton/AppBarButton';
import TabPanel from '../components/TabPanel/TabPanel';
import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import EditableCanvasPanel from '../components/EditableCanvasPanel/EditableCanvasPanel';
import TextPainting from '../annotation/TextPainting';
import TextLayoutViewFocus from '../annotation/TextLayoutViewFocus';
import ImagePainting from '../annotation/ImagePainting';
import VideoPainting from '../annotation/VideoPainting';

import ExhibitionPreview from './TUDelftManifestEditor.ExhibitionPreview';
import ExhibitionCanvasWidthHeight from './TUDelftManifestEditor.ExhibitionCanvasWidthHeight';

import './TUDelftManifestEditor.scss';
import ManifestEditorApp from './ManifestEditorApp';


// Temporary override until the settings panel hasn't been funded.
window.rootManifestUrl =
  'https://delft-static-site-generator.netlify.com/iiif/';
// const emptyFn = () => {};

// const demoManifest = renderResource('Manifest');
// const demoCanvas = renderResource('Canvas', { parent: demoManifest });
// demoManifest.items.push(demoCanvas);

// class TUDelftManifestEditor extends React.Component {
//   state = {
//     rootResource: demoManifest,
//     selectedIdsByType: {
//       Canvas: demoCanvas.id,
//       Annotation: null,
//     },
//     lang: 'en',
//     exhibitionMode: false,
//     exhibitionFullView: false,
//   };

//   changeLanguage = lang => {
//     this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
//   };

//   dispatch = (reducer, action, cb) => {
//     this.setState(reducer(this.state, action), cb || emptyFn);
//   };

//   selectResource = resource => {
//     this.dispatch(EditorReducer, {
//       type: 'TOGGLE_SELECT_RESOURCE',
//       resource,
//     });
//   };

//   deleteResource = resource => {
//     this.dispatch(IIIFReducer, {
//       type: 'REMOVE_RESOURCE',
//       id: resource.id,
//     });
//   };

//   invokeAction2 = (fn, options) => () => {
//     if (!fn) {
//       return;
//     }

//     fn(
//       {
//         state: this.state,
//         dispatch: this.dispatch,
//       },
//       options
//     );
//   };
//   //TODO: deprecated replaced by the above
//   invokeAction = (action, options) => {
//     switch (action) {
//       case 'add-canvas':
//         this.dispatch(IIIFReducer, {
//           type: 'ADD_RESOURCE',
//           options: {
//             type: 'Canvas',
//             parent: this.state.rootResource,
//           },
//         });
//         break;
//       default:
//         break;
//     }
//   };

//   updateProperty = (target, property, lang, value) => {
//     this.dispatch(IIIFReducer, {
//       type: 'UPDATE_RESOURCE_PROPERTY',
//       options: {
//         target,
//         property,
//         lang,
//         value,
//       },
//     });
//   };

//   updateResource = (target, props) => {
//     this.dispatch(IIIFReducer, {
//       type: 'UPDATE_RESOURCE',
//       options: {
//         id: target.id,
//         props,
//       },
//     });
//   };

//   saveProject = () => {
//     download(
//       this.state.rootResource,
//       locale(this.state.rootResource.label, this.state.lang) + '.json'
//     );
//   };

//   newProject = () => {
//     const newManifest = renderResource('Manifest');
//     const newCanvas = renderResource('Canvas', { parent: demoManifest });
//     newManifest.items.push(newCanvas);
//     this.dispatch(IIIFReducer, {
//       type: 'LOAD_MANIFEST',
//       manifest: newManifest,
//     });
//   };

//   togglePreviewDialog = () => {
//     this.setState({
//       previewDialogOpen: !this.state.previewDialogOpen,
//     });
//   };

//   toggleExhibitionMode = () => {
//     this.setState({
//       exhibitionMode: !this.state.exhibitionMode,
//     });
//   };

//   toggleExhibitionFullView = () => {
//     this.setState({
//       exhibitionFullView: !this.state.exhibitionFullView,
//     });
//   };

//   toggleManifestDialog = () => {
//     this.setState({
//       loadManifestDialogOpen: !this.state.loadManifestDialogOpen,
//     });
//   };

//   loadManifest = json => {
//     //console.log(json, convertToV3ifNecessary(json));
//     this.dispatch(IIIFReducer, {
//       type: 'LOAD_MANIFEST',
//       manifest: convertToV3ifNecessary(json),
//     });
//     this.toggleManifestDialog();
//   };

//   render() {
//     const canvases = this.state.rootResource
//       ? this.state.rootResource.items
//       : [];
//     const selectedCanvas = queryResourceById(
//       this.state.selectedIdsByType.Canvas,
//       this.state.rootResource
//     );
//     const annotations =
//       selectedCanvas && selectedCanvas.items && selectedCanvas.items.length > 0
//         ? selectedCanvas.items[0].items || null
//         : null;
//     const selectedAnnotation = queryResourceById(
//       this.state.selectedIdsByType.Annotation,
//       selectedCanvas
//     );
//     const { lang, exhibitionMode, exhibitionFullView } = this.state;
//     return (
//       <MuiThemeProvider theme={theme}>
//         <ManifestEditor
//           invokeAction={this.invokeAction2}
//           config={{
//             s3: {
//               AMZN_S3_IDENTITY_POOL_HASH:
//                 '23b9d884-95a2-4d5c-8a38-e847db51217e',
//               AMZN_S3_REGION: 'eu-west-1',
//               AMZN_S3_BUCKET: 'dlcservices-delft-pre-ingest-uploads',
//             },
//             hideHeaderForSingleTab: true,
//           }}
//           annotation={{
//             'TextualBody::layout-viewport-focus': TextLayoutViewFocus,
//             'TextualBody::painting': TextPainting,
//             'Image::painting': ImagePainting,
//             'Video::painting': VideoPainting,
//           }}
//           translation={{
//             defaultLanguage: 'en',
//             languages: [
//               {
//                 name: 'English',
//                 local: 'English',
//                 1: 'en',
//                 2: 'eng',
//                 '2T': 'eng',
//                 '2B': 'eng',
//                 3: 'eng',
//               },
//               {
//                 name: 'Dutch',
//                 local: 'Nederlands',
//                 1: 'nl',
//                 2: 'nld',
//                 '2T': 'nld',
//                 '2B': 'dut',
//                 3: 'nld',
//               },
//             ],
//           }}
//           behavior={
//             exhibitionMode && {
//               Canvas: {
//                 groups: [
//                   ['row', 'column'],
//                   props => <ExhibitionCanvasWidthHeight {...props} />,
//                   ['caption-left', 'info'],
//                 ],
//               },
//             }
//           }
//         >
//           {/** cause elements generated by @fesk/react-bem cannot have other styles or classes than the predefined bem ones... */}
//           <div
//             className={classnames('tu-delft-manifest-editor', {
//               'tu-delft-manifest-editor--exhibition-mode': exhibitionMode,
//               'tu-delft-manifest-editor--exhibition-full-view': exhibitionFullView,
//             })}
//           >
//             <Layout>
//               <AppBar position="static">
//                 <AppBarButton
//                   text="Load Manifest"
//                   onClick={this.toggleManifestDialog}
//                   icon={<Input />}
//                 />
//                 <AppBarButton
//                   text="New Manifest"
//                   onClick={this.newProject}
//                   icon={<LibraryAdd />}
//                 />
//                 <AppBarButton
//                   text="Download Manifest"
//                   onClick={this.saveProject}
//                   icon={<SaveAlt />}
//                 />
//                 <AppBarButton
//                   text="Preview JSON"
//                   onClick={this.togglePreviewDialog}
//                   icon={<Visibility />}
//                 />
//                 <AppBarButton
//                   text="Exhibition/Standard"
//                   onClick={this.toggleExhibitionMode}
//                   icon={this.state.exhibitionMode ? <GridOn /> : <GridOff />}
//                 />
//               </AppBar>
//               <Layout.Middle>
//                 {!(exhibitionMode && exhibitionFullView) && (
//                   <Layout.Left>
//                     <TabPanel>
//                       <AnnotationList
//                         title="annotations"
//                         annotations={annotations}
//                         lang={lang}
//                         selected={this.state.selectedIdsByType.Annotation}
//                         select={this.selectResource}
//                         remove={this.deleteResource}
//                         invokeAction={this.invokeAction2}
//                         isEditingAllowed={!!this.state.selectedIdsByType.Canvas}
//                       />
//                       {exhibitionMode && (
//                         <ExhibitionPreview
//                           title="Exhibition Preview"
//                           canvases={canvases}
//                           manifest={this.state.rootResource}
//                           direction="vertical"
//                           lang={lang}
//                           selected={this.state.selectedIdsByType.Canvas}
//                           select={this.selectResource}
//                           remove={this.deleteResource}
//                           invokeAction={this.invokeAction}
//                           toggleZoom={this.toggleExhibitionFullView}
//                         />
//                       )}
//                     </TabPanel>
//                   </Layout.Left>
//                 )}

//                 {!(exhibitionMode && exhibitionFullView) ? (
//                   <Layout.Center>
//                     <EditableCanvasPanel
//                       title="annotations"
//                       canvas={selectedCanvas}
//                       selectedAnnotation={
//                         this.state.selectedIdsByType.Annotation
//                       }
//                       select={this.selectResource}
//                       update={this.updateResource}
//                     />
//                   </Layout.Center>
//                 ) : (
//                   <Layout.Center>
//                     <TabPanel>
//                       <AnnotationList
//                         title="annotations"
//                         annotations={annotations}
//                         lang={lang}
//                         selected={this.state.selectedIdsByType.Annotation}
//                         select={this.selectResource}
//                         remove={this.deleteResource}
//                         invokeAction={this.invokeAction2}
//                         isEditingAllowed={!!this.state.selectedIdsByType.Canvas}
//                       />
//                       {exhibitionMode && (
//                         <ExhibitionPreview
//                           title="Exhibition Preview"
//                           canvases={canvases}
//                           manifest={this.state.rootResource}
//                           direction="vertical"
//                           lang={lang}
//                           selected={this.state.selectedIdsByType.Canvas}
//                           select={this.selectResource}
//                           remove={this.deleteResource}
//                           invokeAction={this.invokeAction}
//                           toggleZoom={this.toggleExhibitionFullView}
//                         />
//                       )}
//                     </TabPanel>
//                   </Layout.Center>
//                 )}
//                 <Layout.Right>
//                   <TabPanel>
//                     <DLCSPanel
//                       title="DLCS"
//                       //TODO: remove hard wired account
//                       account={{
//                         endpoint: 'https://api.dlc.services/',
//                         customer: 7,
//                       }}
//                     />
//                     <IIIFCollectionExplorer title="IIIF Explorer" />
//                     <Properties
//                       title="Properties"
//                       manifest={this.state.rootResource}
//                       canvas={selectedCanvas}
//                       annotation={selectedAnnotation}
//                       lang={lang}
//                       changeLanguage={this.changeLanguage}
//                       update={this.updateProperty}
//                     />
//                   </TabPanel>
//                 </Layout.Right>
//               </Layout.Middle>
//               {!exhibitionMode && (
//                 <Layout.Bottom>
//                   <CanvasList
//                     canvases={canvases}
//                     lang={lang}
//                     direction="horizontal"
//                     selected={this.state.selectedIdsByType.Canvas}
//                     select={this.selectResource}
//                     remove={this.deleteResource}
//                     invokeAction={this.invokeAction}
//                   />
//                 </Layout.Bottom>
//               )}
//             </Layout>
//           </div>
//         </ManifestEditor>
//         <SourcePreviewDialog
//           json={this.state.rootResource}
//           open={this.state.previewDialogOpen}
//           handleClose={this.togglePreviewDialog}
//         />
//         <DefaultLoadManifestDialog
//           open={this.state.loadManifestDialogOpen}
//           loadManifest={this.loadManifest}
//           handleClose={this.toggleManifestDialog}
//         />
//       </MuiThemeProvider>
//     );
//   }
// }

class TUDelftManifestEditor extends ManifestEditorApp {
  getConfig = () => ({
    config: {
      s3: {
        AMZN_S3_IDENTITY_POOL_HASH:
          '23b9d884-95a2-4d5c-8a38-e847db51217e',
        AMZN_S3_REGION: 'eu-west-1',
        AMZN_S3_BUCKET: 'dlcservices-delft-pre-ingest-uploads',
      },
      hideHeaderForSingleTab: true,
    },
    annotation: {
      'TextualBody::layout-viewport-focus': TextLayoutViewFocus,
      'TextualBody::painting': TextPainting,
      'Image::painting': ImagePainting,
      'Video::painting': VideoPainting,
    },
    translation: {
      defaultLanguage: 'en',
      languages: [
        {
          name: 'English',
          local: 'English',
          1: 'en',
          2: 'eng',
          '2T': 'eng',
          '2B': 'eng',
          3: 'eng',
        },
        {
          name: 'Dutch',
          local: 'Nederlands',
          1: 'nl',
          2: 'nld',
          '2T': 'nld',
          '2B': 'dut',
          3: 'nld',
        },
      ],
    },
    behavior: this.state.exhibitionMode && {
      Canvas: {
        groups: [
          ['row', 'column'],
          props => <ExhibitionCanvasWidthHeight {...props} />,
          ['caption-left', 'info'],
        ],
      },
    }
  });

  toggleExhibitionMode = () => {
    this.setState({
      exhibitionMode: !this.state.exhibitionMode,
    });
  };

  toggleExhibitionFullView = () => {
    this.setState({
      exhibitionFullView: !this.state.exhibitionFullView,
    });
  };

  render() {
    return (
      <div
        className={classnames('tu-delft-manifest-editor', {
          'tu-delft-manifest-editor--exhibition-mode': this.state.exhibitionMode,
          'tu-delft-manifest-editor--exhibition-full-view': this.state.exhibitionFullView,
        })}
      >
        {super.render()}
      </div>   
    )
  }

  renderAppBarButtons = () => (
    <React.Fragment>
      <AppBarButton
        text="Load Manifest"
        onClick={this.toggleManifestDialog}
        icon={<Input />}
      />
      <AppBarButton
        text="New Manifest"
        onClick={this.newProject}
        icon={<LibraryAdd />}
      />
      <AppBarButton
        text="Download Manifest"
        onClick={this.saveProject}
        icon={<SaveAlt />}
      />
      <AppBarButton
        text="Preview JSON"
        onClick={this.togglePreviewDialog}
        icon={<Visibility />}
      />
      <AppBarButton
        text="Exhibition/Standard"
        onClick={this.toggleExhibitionMode}
        icon={this.state.exhibitionMode ? <GridOn /> : <GridOff />}
      />
    </React.Fragment>
  );

  renderLeftPanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => 
    !(this.state.exhibitionMode && this.state.exhibitionFullView) && (
      <TabPanel>
        <AnnotationList
          title="annotations"
          getResource={this.getResource}
          annotations={paintingAnnotations}
          lang={lang}
          selected={this.state.selectedIdsByType.Annotation}
          select={this.selectResource}
          remove={this.deleteResource}
          invokeAction={this.invokeAction2}
          isEditingAllowed={!!this.state.selectedIdsByType.Canvas}
        />
        {this.state.exhibitionMode && (
          <ExhibitionPreview
            title="Exhibition Preview"
            getResource={this.getResource}
            resources={this.state.resources}
            canvases={canvases}
            manifest={this.state.resources[this.state.rootResource]}
            direction="vertical"
            lang={lang}
            selected={this.state.selectedIdsByType.Canvas}
            select={this.selectResource}
            remove={this.deleteResource}
            invokeAction={this.invokeAction}
            toggleZoom={this.toggleExhibitionFullView}
          />
        )}
      </TabPanel>
    );

  renderCentrePanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => 
    !(this.state.exhibitionMode && this.state.exhibitionFullView) ? (
      <EditableCanvasPanel
        title="annotations"
        canvas={selectedCanvas}
        resources={this.state.resources}
        selectedAnnotation={this.state.selectedIdsByType.Annotation}
        select={this.selectResource}
        update={this.updateProperty}
        getResource={this.getResource}
      />
    ) : (
      <TabPanel>
        <AnnotationList
          title="annotations"
          getResource={this.getResource}
          annotations={paintingAnnotations}
          lang={lang}
          selected={this.state.selectedIdsByType.Annotation}
          select={this.selectResource}
          remove={this.deleteResource}
          invokeAction={this.invokeAction2}
          isEditingAllowed={!!this.state.selectedIdsByType.Canvas}
        />
        {this.state.exhibitionMode && (
          <ExhibitionPreview
            getResource={this.getResource}
            resources={this.state.resources}
            title="Exhibition Preview"
            canvases={canvases}
            manifest={this.state.resources[this.state.rootResource]}
            direction="vertical"
            lang={lang}
            selected={this.state.selectedIdsByType.Canvas}
            select={this.selectResource}
            remove={this.deleteResource}
            invokeAction={this.invokeAction}
            toggleZoom={this.toggleExhibitionFullView}
          />
        )}
      </TabPanel>
    );
  
  renderBottomPanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => 
    !this.state.exhibitionMode && (
      <CanvasList
        getResource={this.getResource}
        canvases={canvases}
        lang={lang}
        direction="horizontal"
        selected={this.state.selectedIdsByType.Canvas}
        select={this.selectResource}
        remove={this.deleteResource}
        invokeAction={this.invokeAction}
      />
    );
}

export default TUDelftManifestEditor;