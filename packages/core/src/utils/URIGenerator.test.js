import generateURI from './URIGenerator';

describe('generateURI', () => {
  it('generates URI for Manifest', () => {
    const manifestWithId = generateURI({
      type: 'Manifest',
    });
    expect(manifestWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on a Manifest', () => {
    const manifestWithId = generateURI(
      {
        type: 'Manifest',
      },
      null,
      {
        id: 'test-human-readable-id',
      }
    );
    expect(manifestWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest'
    );
  });

  it('generates URI for Canvas', () => {
    const canvasWithId = generateURI(
      {
        type: 'Canvas',
      },
      {
        type: 'Manifest',
        id: 'http://digirati.com/iiif/v3/test-manifest-id/manifest',
      }
    );
    expect(canvasWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on a Canvas', () => {
    const canvasWithId = generateURI(
      {
        type: 'Canvas',
      },
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest',
      {
        id: 'canvas-id',
      }
    );
    expect(canvasWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/canvas/canvas-id'
    );
  });

  it('generates URI for Annotation', () => {
    const annotationWithId = generateURI(
      {
        type: 'Annotation',
      },
      {
        type: 'Manifest',
        id: 'http://digirati.com/iiif/v3/test-manifest-id/manifest',
      }
    );
    expect(annotationWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on an Annotation', () => {
    const annotationWithId = generateURI(
      {
        type: 'Annotation',
      },
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest',
      {
        id: 'annotation-id',
      }
    );
    expect(annotationWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/annotation/annotation-id'
    );
  });

  it('generates URI for AnnotationPage', () => {
    const annotationPageWithId = generateURI(
      {
        type: 'AnnotationPange',
      },
      {
        type: 'Canvas',
        id: 'http://digirati.com/iiif/v3/test-manifest-id/canvas/c1',
      }
    );
    expect(annotationPageWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on an AnnotationPage', () => {
    const annotationPageWithId = generateURI(
      {
        type: 'AnnotationPage',
      },
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest',
      {
        id: 'annotation-page-id',
      }
    );
    expect(annotationPageWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/list/annotation-page-id'
    );
  });

  it('generates URI for Range', () => {
    const rangeWithId = generateURI(
      {
        type: 'Range',
      },
      {
        type: 'Manifest',
        id: 'http://digirati.com/iiif/v3/test-manifest-id/manifest',
      }
    );
    expect(rangeWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on a Range', () => {
    const rangeWithId = generateURI(
      {
        type: 'AnnotationPage',
      },
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest',
      {
        id: 'range-id',
      }
    );
    expect(rangeWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/range/range-id'
    );
  });

  it('generates URI for unknown type', () => {
    // TODO: is this correct? Shouldn't it just pass the given id?
    const unkownTypeWithId = generateURI(
      {
        type: 'ImageService',
      },
      'http://digirati.com/iiif/v3/test-manifest-id/manifest'
    );
    expect(unkownTypeWithId).toHaveProperty('id');
  });

  it('generates URI for the given id on an unknown type', () => {
    // TODO: is this correct? Shouldn't it just pass the given id?
    const unkownTypeWithId = generateURI(
      {
        type: 'AnnotationPage',
      },
      'http://digirati.com/iiif/v3/test-human-readable-id/manifest',
      {
        id: 'image-service-id',
      }
    );
    expect(unkownTypeWithId.id).toEqual(
      'http://digirati.com/iiif/v3/test-human-readable-id/imageservice/image-service-id'
    );
  });
});
