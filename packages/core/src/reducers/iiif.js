/**
 * Reducer to mutate iiif presentation v3 resources and W3c annotations.
 * @param {Object} state - current state to mutate
 * @param {*} action - action object with the parametes
 */
const IIIFReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RESOURCE':
    // Calls the resource template provider which renders the requested resource @type
    // Puts it into the passed @parent position and @index (if index is specified)
    case 'ADD_SPECIFIC_RESOURCE':
    // Used for copying resources from other manifests, receives existing @resource.
    // Puts it into the passed @parent position and @index (if index is specified)
    case 'REMOVE_RESOURCE':
    // Removes the resource for the the passed @parent position and @index (index is
    // mandatory in this case)
    case 'UPDATE_RESOURCE':
    // Updates the passed resource @id, NOTE it is a property merge
    case 'UPDATE_RESOURCE_ORDER':
    // Move @resource_id to @index
    case 'LOAD_MANIFEST':
    // @jsonLd or @uri or resource template provider called
    default:
      return state;
  }
};
