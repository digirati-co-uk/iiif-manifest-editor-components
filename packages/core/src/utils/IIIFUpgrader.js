import Upgrader from 'iiif-prezi2to3';

const IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE =
  'http://iiif.io/api/presentation/3/context.json';

const convertToV3ifNecessary = manifest => {
  const context = manifest['@context'];
  const isNotP3 =
    context &&
    ((context.constructor === Array &&
      !context.includes(IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE)) ||
      (context.constructor === String &&
        !context !== IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE));
  if (isNotP3) {
    return new Upgrader({
      deref_links: false,
      default_lang: 'en',
    }).processResource(manifest, true);
  } else {
    return manifest;
  }
};

export default convertToV3ifNecessary;
