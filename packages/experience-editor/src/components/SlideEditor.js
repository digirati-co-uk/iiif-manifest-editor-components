import React from 'react';
import { Manifest, RangeNavigationProvider } from '@canvas-panel/core';
import { Slide } from '@canvas-panel/slideshow';
import { transformSlideCanvas } from '../utils';
import { saveResource } from '@iiif-mec/core';

const transformHeaderHack = canvas => {
  if (
    canvas.items.length &&
    canvas.items[0] &&
    canvas.items[0].items.length &&
    canvas.items[0].items[0] &&
    canvas.items[0].items[0].body &&
    canvas.items[0].items[0].body.service &&
    !Array.isArray(canvas.items[0].items[0].body.service)
  ) {
    canvas.items[0].items[0].body.service.type =
      'ImageService2';
    canvas.items[0].items[0].body.service.profile = 'level1';
    canvas.items[0].items[0].body.service = [
      canvas.items[0].items[0].body.service,
    ];
  }
};

const renderManifest = canvas => ({
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  id: 'manifest_' + new Date().getTime(),
  type: 'Manifest',
  items: [canvas]
});

const SlideEditor = ({ selectedCanvas, resources }) => {
  if (!selectedCanvas) {
    return 'Please select a slide to edit';
  }
  
  const rawCanvas = saveResource(selectedCanvas.id, resources);
  if (rawCanvas) {
    transformHeaderHack(rawCanvas);
    rawCanvas.id = 'cnvs_' + new Date().getTime();
    rawCanvas.items[0].items[0].target = rawCanvas.id;
  }
  const manifestJSONLD = renderManifest(rawCanvas);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
     <Manifest key={manifestJSONLD.id} jsonLd={manifestJSONLD}>
        <RangeNavigationProvider currentIndex={0}>
          {({ manifest, canvas, region }) => (
            <Slide
              fullscreenProps={{
                isFullscreen: false,
              }}
              behaviors={canvas.__jsonld.behavior || []}
              manifest={manifest}
              canvas={canvas}
              region={region}
            />
          )}
        </RangeNavigationProvider>
      </Manifest>
    </div>
  );
};

export default SlideEditor;
