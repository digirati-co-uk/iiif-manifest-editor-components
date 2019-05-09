import * as React from 'react';
import * as PropTypes from 'prop-types';
import { FullPageViewer } from '@canvas-panel/full-page-plugin';
import { PatchworkPlugin } from '@canvas-panel/patchwork-plugin';
import { SlideShow } from '@canvas-panel/slideshow';

const RenderManifest = ({ manifest, isDemoPage }) => {
  const isAnnotatedZoom =
    manifest &&
    manifest.behavior &&
    manifest.behavior.filter(behavior => behavior === 'vam-annotated-zoom')
      .length > 0;

  if (isAnnotatedZoom && isDemoPage) {
    return (
      <FullPageViewer
        jsonLd={manifest}
        title="Preview"
        annotationPosition="top"
      >
        <p>Scroll down to start or click the 'start tour' button.</p>
        <span className="muted">
          © Victoria and Albert Museum, London {new Date().getYear()}
        </span>
      </FullPageViewer>
    );
  } else if (isAnnotatedZoom && !isDemoPage) {
    return (
      <div className="patchwork-container">
        <PatchworkPlugin
          jsonLdManifest={manifest}
          cssClassMap={{
            annotation: 'annotation-pin',
          }}
          cssClassPrefix="patchwork-"
          height={500}
          width={1200}
        />
      </div>
    );
  } else {
    return <SlideShow jsonLd={manifest} />;
  }
};

RenderManifest.propTypes = {
  manifest: PropTypes.any,
  isDemoPage: PropTypes.bool,
};

RenderManifest.defaultProps = {
  isDemoPage: false,
};

export default RenderManifest;
