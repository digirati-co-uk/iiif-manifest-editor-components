import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { DragDropContext } from 'react-beautiful-dnd';
import ManifestEditor from './ManifestEditor.js';


// Complex props - come back to this component
// storiesOf('ManifestEditor', module)
//   .addDecorator(withKnobs)
//   .add('ManifestEditor', () => {
//     return (
//       <DragDropContext onDragEnd={() => {}}>
//         <ManifestEditor
//         />
//       </DragDropContext>
//     );
//   });
