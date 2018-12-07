import produce from 'immer';
import renderResource, {
  queryResourceById,
  getParentByChildId,
} from '../utils/IIIFResource';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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

        // TODO: decide that we always use parent as an element or an id
        // - if we keep parent as an element
        //    - easier e element lookups
        //    - but references may get out of sync
        // - with ids
        //    - we explicity refer to the object ergo we always get the freshest version
        //    - the cost of this freshness is high, because every time we touch the object
        //      the functions need to traverse through the document, and it's like a
        //      dom traversal with all it's non linear characteristic.
        //    - remember queryResourceById is a recursive function, which is extremely
        //      dangerous if a circular reference accidentally created in the manifest.
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

        // this part is a bit of chaos, TODO: clean up
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
        const toRemoveFrom = getParentByChildId(
          action.id,
          nextState.rootResource
        );
        toRemoveFrom.items = toRemoveFrom.items.filter(
          resource => resource.id !== action.id
        );
        Object.entries(nextState.selectedIdsByType).forEach(([type, id]) => {
          if (id === action.id) {
            nextState.selectedIdsByType[type] = null;
          }
        });
        break;
      case 'UPDATE_RESOURCE':
        // Updates the passed resource @id, NOTE it is a property merge
        const toUpdate = queryResourceById(options.id, nextState.rootResource);
        Object.assign(toUpdate, options.props || {});
        break;
      case 'UPDATE_RESOURCE_ORDER':
        const { startIndex, targetIndex, id } = action.options;
        const parentToUpdate = getParentByChildId(id, nextState.rootResource);
        parentToUpdate.items = reorder(
          parentToUpdate.items,
          startIndex,
          targetIndex
        );
        break;
      case 'LOAD_MANIFEST':
        nextState.rootResource = action.manifest;
        // This is wrong selection should be isolated this, maybe sagas
        nextState.selectedIdsByType.Canvas =
          action.manifest.items.length > 0 ? action.manifest.items[0].id : null;
        nextState.selectedIdsByType.Annotation = null;
        break;
      default:
        break;
    }
  });
};

export default IIIFReducer;
