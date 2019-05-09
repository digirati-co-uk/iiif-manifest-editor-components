import annotatedZoom from './annotated-zoom.js';
import slideshow from './slideshow.js';
import iiifManifest from './default.js';

let rootManifestUrl;

try {
  rootManifestUrl = process.env.COLLECTION_SERVER;
} catch (ex) {
  // fallback settings
  const isLocalhost = () =>
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0';

  rootManifestUrl = isLocalhost()
    ? 'http://localhost:8181/p3/'
    : 'https://iiif-collection.ch.digtest.co.uk/p3/';
}

export default {
  rootManifestUrl,
  'annotated-zoom': annotatedZoom,
  slideshow,
  [`default`]: iiifManifest,
};
