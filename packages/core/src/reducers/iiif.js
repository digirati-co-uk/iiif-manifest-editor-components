import produce from 'immer';
import renderResource, {
  queryResourceById,
  getPath,
} from '../utils/IIIFResource';

/**
 * Reducer to mutate iiif presentation v3 resources and W3c annotations.
 * @param {Object} state - current state to mutate
 * @param {*} action - action object with the parametes
 */
const IIIFReducer = (state, action) => {
  return produce(state, nextState => {
    const options = action.options;
    switch (action.type) {
      case 'ADD_RESOURCE':
        // Calls the resource template provider which renders the requested resource @type
        // Puts it into the passed @parent position and @index (if index is specified)
        const parentId = !options.parent
          ? null
          : typeof options.parent === 'string'
          ? options.parent
          : options.parent.id;

        const parent = queryResourceById(parentId, nextState.rootResource);
        const newResource = renderResource(options.type, {
          props: options.props || {},
          parent: parent,
        });
        if (parent) {
          let targetCollection = parent.items;
          if (parent.type === 'Manifest' && newResource.type === 'Rage') {
            if (!parent.structures) {
              parent.structures = [];
            }
            targetCollection = parent.structures;
          } else if (
            parent.type === 'Canvas' &&
            newResource.type === 'Annotation'
          ) {
            if (parent.items.length === 0) {
              targetCollection = renderResource('AnnotationPage', {
                parent: newResource,
              });
              parent.items.push(targetCollection);
            }
            targetCollection = parent.items[0].items;
          }
          if (typeof options.index === 'number') {
            targetCollection.splice(
              Math.max(0, Math.min(options.index, parent.items.length)),
              0,
              newResource
            );
          } else {
            targetCollection.push(newResource);
          }
        } else {
          nextState.rootResource = newResource;
        }
        break;
      case 'ADD_SPECIFIC_RESOURCE':
      // Used for copying resources from other manifests, receives existing @resource.
      // Puts it into the passed @parent position and @index (if index is specified)
      case 'REMOVE_RESOURCE':
        //const path = getPath(options.id, nextState);
        //console.log('path', path);
        break;
      // Removes the resource for the the passed @parent position and @index (index is
      // mandatory in this case)
      case 'UPDATE_RESOURCE':
        // Updates the passed resource @id, NOTE it is a property merge
        const toUpdate = queryResourceById(options.id, nextState.rootResource);
        Object.assign(toUpdate, options.props || {});
        break;
      case 'UPDATE_RESOURCE_ORDER':
      // Move @resource_id to @index
      case 'LOAD_MANIFEST':
        // @jsonLd or @uri or resource template provider called
        nextState.rootResource = options.manifest;
        break;
      default:
        break;
    }
  });
};

export default IIIFReducer;
