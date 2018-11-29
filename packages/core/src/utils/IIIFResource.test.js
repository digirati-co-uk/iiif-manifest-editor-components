import renderResource, { queryResourceById } from './IIIFResource';

describe('renderResource', () => {
  it('renders default Manifest', () => {
    const expectedManifest = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [],
    };
    const manifest = renderResource('Manifest');
    Object.keys(manifest).forEach(
      key =>
        key !== 'id' && expect(manifest[key]).toEqual(expectedManifest[key])
    );
  });

  it('renders default Canvas', () => {
    const expectedCanvas = {
      label: { en: ['Untitled Canvas'] },
      height: 1000,
      width: 1000,
      type: 'Canvas',
      items: [{ type: 'AnnotationPage', items: [] }],
    };
    const canvas = renderResource('Canvas');
    expect(canvas).toEqual(expectedCanvas);
  });

  it('renders default Annotation', () => {
    const EXPECTED_ANNOTATION = {
      type: 'Annotation',
      motivation: 'painting',
      label: { en: ['Untitled Annotation'] },
      body: {
        type: 'TextualBody',
        value: 'Untitled Annotation Body',
        format: 'text/plain',
      },
    };
    const annotation = renderResource('Annotation');
    expect(annotation).toEqual(EXPECTED_ANNOTATION);
  });

  it('renders default Unknown type', () => {
    const EXPECTED_TYPE = { type: 'TestType' };
    const testType = renderResource('TestType');
    expect(testType).toEqual(EXPECTED_TYPE);
  });
});

describe('queryResourceById', () => {
  it('finds the top level resource', () => {
    const rootResource = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [],
      id: 'test-manifest',
    };
    const queryResult = queryResourceById('test-manifest', rootResource);
    expect(queryResult).toEqual(rootResource);
  });

  it('it returns null if the id is null', () => {
    const rootResource = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [],
      id: 'test-manifest',
    };
    const queryResult = queryResourceById(null, rootResource);
    expect(queryResult).toBeNull();
  });

  it('it returns null the id hasn been found', () => {
    const rootResource = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [],
      id: 'test-manifest',
    };
    const queryResult = queryResourceById('test-manifest-2', rootResource);
    expect(queryResult).toBeNull();
  });

  it('finds a canvas', () => {
    const rootResource = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [
        {
          type: 'Canvas',
          id: 'test-canvas',
        },
      ],
      id: 'test-manifest',
    };
    const queryResult = queryResourceById('test-canvas', rootResource);
    expect(queryResult).toEqual(rootResource.items[0]);
  });

  it('finds an annotation', () => {
    const rootResource = {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      type: 'Manifest',
      label: { en: ['Untitled Manifest'] },
      items: [
        {
          type: 'Canvas',
          id: 'test-canvas',
          items: [
            {
              type: 'AnnotationPage',
              id: 'test-annotation-page',
              items: [
                {
                  type: 'Annotation',
                  id: 'test-annotation',
                },
              ],
            },
          ],
        },
      ],
      id: 'test-manifest',
    };
    const queryResult = queryResourceById('test-annotation', rootResource);
    expect(queryResult).toEqual(rootResource.items[0].items[0].items[0]);
  });
});
