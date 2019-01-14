import Upgrader from 'iiif-prezi2to3';

const IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE =
  'http://iiif.io/api/presentation/3/context.json';

const DEFAULT_LANG = 'en';

const isP3Context = context =>
  context &&
  ((context.constructor === Array &&
    context.includes(IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE)) ||
    (context.constructor === String &&
      context !== IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE));

const convertToV3ifNecessary = manifest => {
  const context = manifest['@context'];
  return isP3Context(context)
    ? manifest
    : new Upgrader({
        deref_links: false,
        default_lang: DEFAULT_LANG,
      }).processResource(manifest, true);
};

export default convertToV3ifNecessary;
