const processLevel = (iiifResource, results = {}, parentId = null) => {
  if (
    typeof iiifResource === 'string' ||
    typeof iiifResource === 'number' ||
    typeof iiifResource === 'boolean'
  ) {
    return results;
  }

  if (
    iiifResource.hasOwnProperty('id') &&
    iiifResource.hasOwnProperty('type') &&
    !iiifResource.hasOwnProperty('@id')
  ) {
    if (results.hasOwnProperty(iiifResource.id)) {
      iiifResource['@id'] = parentId + '-' + iiifResource.id;
    } else {
      iiifResource['@id'] = iiifResource.id;
    }
    results[iiifResource['@id']] = iiifResource;
    if (parentId && !iiifResource.hasOwnProperty('@parent')) {
      iiifResource['@parent'] = parentId;
    }
  }

  Object.entries(iiifResource).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      iiifResource[key] = value.map(child => {
        processLevel(child, results, iiifResource['@id'] || parentId);
        return child['@id'] || child;
      });
    }
    processLevel(value, results, iiifResource['@id'] || parentId);
    iiifResource[key] = value['@id'] || value;
  });

  return results;
};

const saveLevel = (flatFile, currentLevel) => {
  let currentResult;
  if (typeof currentLevel === 'string') {
    if (flatFile[currentLevel]) {
      return saveLevel(flatFile, flatFile[currentLevel]);
    } else {
      return currentLevel;
    }
  } else if (
    typeof currentLevel === 'number' ||
    typeof currentLevel === 'boolean'
  ) {
    return currentLevel;
  } else if (Array.isArray(currentLevel)) {
    return currentLevel.map(item => saveLevel(flatFile, item));
  } else {
    currentResult = {};
    Object.entries(currentLevel).forEach(([key, value]) => {
      if (key === '@parent' || key === '@id') {
        return;
      }
      if (key === 'id' || key === 'target') {
        currentResult[key] = value;
      } else {
        currentResult[key] = saveLevel(flatFile, value);
      }
    });
  }
  return currentResult;
};

/**
 * flatten the IIIF manifest
 */
const loadResource = iiifResource =>
  processLevel(JSON.parse(JSON.stringify(iiifResource)));

/**
 * converts the internal data representation into IIIF format
 */
const saveResource = (startId, flatFile) =>
  saveLevel(flatFile, flatFile[startId], {});
