//TODO: make it configurable
const rootURL = 'http://digirati.com/iiif/v3/';

// private
const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

// private
export const guid = (pattern = 'ss-s-s-s-sss') => pattern.replace(/s/g, s4);

/**
 * Generates a URI for the resource passed.
 * @param {Object} resource - the resource requires an id or an id refresh
 * @param {Object} parent - the parent resource if applicable
 * @return {Object} the resource with the id
 */
const generateURI = (resource, parent = null, options = {}) => {
  switch (resource.type) {
    case 'Manifest':
      const manifestBaseUrl = window.rootManifestUrl || rootURL;
      const baseUrl = manifestBaseUrl.endsWith('/')
        ? manifestBaseUrl
        : manifestBaseUrl + '/';
      //{scheme}://{host}/{prefix}/{identifier}/manifest
      resource.id = `${baseUrl}${options.id || guid()}/manifest`;
      break;
    case 'Canvas':
    // {scheme}://{host}/{prefix}/{identifier}/canvas/{name}
    case 'Annotation':
    // {scheme}://{host}/{prefix}/{identifier}/annotation/{name}
    case 'AnnotationPage':
    //	{scheme}://{host}/{prefix}/{identifier}/list/{name}
    case 'Range':
    // {scheme}://{host}/{prefix}/{identifier}/range/{name}
    default:
      if (parent) {
        let parentId = null;
        if (typeof parent.id === 'string') {
          parentId = parent.id;
        } else if (typeof parent === 'string') {
          parentId = parent;
        }
        if (parentId) {
          const resourcePath =
            resource.type === 'AnnotationPage'
              ? 'list'
              : resource.type.toLowerCase();
          resource.id =
            parentId.replace(
              /\/(manifest|canvas|annotation|list|range)(\/.*)?$/,
              ''
            ) + `/${resourcePath}/${options.id || guid()}`;
        }
      } // TODO: else { is this even possible }
  }
  return resource;
};

export default generateURI;
