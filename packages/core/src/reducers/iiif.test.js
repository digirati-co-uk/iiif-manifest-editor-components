import IIIFReducer from './iiif';

describe('IIIF Reducer', () => {
  describe('ADD_RESOURCE', () => {
    it("is adding resource to the state's root resource if parent hasn't been defined", () => {
      const TEST_MANIFEST = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          'http://iiif.io/api/presentation/3/context.json',
        ],
        type: 'Manifest',
        label: {
          en: ['Untitled Manifest'],
        },
        items: [],
      };
      const state = {
        rootResource: null,
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          type: 'Manifest',
        },
      });
      expect(newState.rootResource['@context']).toEqual(
        TEST_MANIFEST['@context']
      );
      expect(newState.rootResource.type).toEqual(TEST_MANIFEST.type);
      expect(newState.rootResource.label).toEqual(TEST_MANIFEST.label);
      expect(newState.rootResource.items).toEqual(TEST_MANIFEST.items);
      expect(newState.rootResource).toHaveProperty('id');
    });

    it('is adding resource to the resource id passed as string in the options.parent', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: 'https://test.com/iiif/test/manifest',
          type: 'Canvas',
        },
      });
      expect(newState.rootResource.items).toHaveLength(1);
      expect(newState.rootResource.items[0]).toHaveProperty('type');
      expect(newState.rootResource.items[0].type).toEqual('Canvas');
    });

    it('is adding resource to the resource passed as options.parent', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: {
            id: 'https://test.com/iiif/test/manifest',
          },
          type: 'Canvas',
        },
      });
      expect(newState.rootResource.items).toHaveLength(1);
      expect(newState.rootResource.items[0]).toHaveProperty('type');
      expect(newState.rootResource.items[0].type).toEqual('Canvas');
    });

    it('is able to override properties coming from options.props', () => {
      const state = {
        rootResource: null,
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          type: 'Manifest',
          props: {
            label: {
              en: ['test manifest label'],
            },
            metadata: [
              {
                label: {
                  en: ['Creator'],
                },
                value: {
                  en: ['Jester The Tester'],
                },
              },
            ],
          },
        },
      });

      expect(newState.rootResource).not.toBe(null);
      expect(newState.rootResource.label.en).toEqual(['test manifest label']);
      expect(newState.rootResource.metadata).toHaveLength(1);
      expect(newState.rootResource.metadata[0].label.en).toEqual(['Creator']);
      expect(newState.rootResource.metadata[0].value.en).toEqual([
        'Jester The Tester',
      ]);
    });

    it('adds the resource at the specific index', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: 'https://test.com/iiif/test/manifest',
          type: 'Canvas',
          props: {
            label: {
              en: ['test canvas'],
            },
          },
          index: 1,
        },
      });
      expect(newState.rootResource.items).toHaveLength(3);
      expect(newState.rootResource.items[1].id).not.toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.rootResource.items[1].type).toEqual('Canvas');
      expect(newState.rootResource.items[1].label.en).toEqual(['test canvas']);
    });

    it("if the specified index is larger than the target resource's items size it adds the item at the last position", () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: 'https://test.com/iiif/test/manifest',
          type: 'Canvas',
          props: {
            label: {
              en: ['test canvas'],
            },
          },
          index: 1,
        },
      });
      expect(newState.rootResource.items).toHaveLength(3);
      expect(newState.rootResource.items[1].id).not.toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.rootResource.items[1].type).toEqual('Canvas');
      expect(newState.rootResource.items[1].label.en).toEqual(['test canvas']);
    });

    it("negative indexes are included as the first item in the resource's collection ", () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: 'https://test.com/iiif/test/manifest',
          type: 'Canvas',
          props: {
            label: {
              en: ['test canvas'],
            },
          },
          index: -1,
        },
      });
      expect(newState.rootResource.items).toHaveLength(3);
      expect(newState.rootResource.items[0].id).not.toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
      expect(newState.rootResource.items[0].type).toEqual('Canvas');
      expect(newState.rootResource.items[0].label.en).toEqual(['test canvas']);
    });

    //TODO: it throws error if no rootResource in the state?
  });

  describe('REMOVE_RESOURCE', () => {
    it('removes the specified resource id from the project resources', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'REMOVE_RESOURCE',
        options: {
          id: 'https://test.com/iiif/test/canvas/1',
        },
      });
      expect(newState.rootResource.items).toHaveLength(1);
      expect(newState.rootResource.items[0].id).not.toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
      expect(newState.rootResource.items[0].id).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
    });

    it('removes the specified resource id under a certain parent', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
              items: [
                {
                  id: 'https://test.com/iiif/test/list/1',
                  type: 'AnnotationList',
                  items: [
                    {
                      id: 'https://test.com/iiif/test/annotation/1',
                      type: 'Annotation',
                    },
                  ],
                },
              ],
              annotations: [
                {
                  id: 'https://test.com/iiif/test/list/2',
                  type: 'AnnotationList',
                  items: [
                    {
                      id: 'https://test.com/iiif/test/annotation/1',
                      type: 'Annotation',
                    },
                  ],
                },
              ],
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
              items: [
                {
                  id: 'https://test.com/iiif/test/list/3',
                  type: 'AnnotationList',
                  items: [
                    {
                      id: 'https://test.com/iiif/test/annotation/1',
                      type: 'Annotation',
                    },
                  ],
                },
              ],
              annotations: [
                {
                  id: 'https://test.com/iiif/test/list/4',
                  type: 'AnnotationList',
                  items: [
                    {
                      id: 'https://test.com/iiif/test/annotation/1',
                      type: 'Annotation',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'REMOVE_RESOURCE',
        options: {
          id: 'https://test.com/iiif/test/annotation/1',
          parent: 'https://test.com/iiif/test/list/1',
        },
      });
      expect(newState.rootResource.items[0].items[0].items).toHaveLength(0);
      expect(newState.rootResource.items[0].annotations[0].items).toHaveLength(
        1
      );
      expect(newState.rootResource.items[1].items[0].items).toHaveLength(1);
      expect(newState.rootResource.items[1].annotations[0].items).toHaveLength(
        1
      );
    });
  });

  describe('UPDATE_RESOURCE', () => {
    it('updates the passed resource', () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE',
        options: {
          id: 'https://test.com/iiif/test/manifest',
          props: {
            label: {
              en: ['test label'],
            },
          },
        },
      });
      expect(newState.rootResource.label.en).toEqual(['test label']);
    });
  });

  describe('UPDATE_RESOURCE_ORDER', () => {
    it("moves the resource to a the passed index on it's parent", () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/2',
          index: 0,
        },
      });
      expect(newState.rootResource.items[0].id).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.rootResource.items[1].id).toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
    });

    it("moves the resource to a the last index on it's parent if the index is larger than the number of contained resources on the parent", () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/1',
          index: 3,
        },
      });
      expect(newState.rootResource.items[0].id).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.rootResource.items[1].id).toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
    });
    it("negative indexes are interpreted as the first item in the resource's collection ", () => {
      const state = {
        rootResource: {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          id: 'https://test.com/iiif/test/manifest',
          type: 'Manifest',
          label: {
            en: ['Untitled Manifest'],
          },
          items: [
            {
              id: 'https://test.com/iiif/test/canvas/1',
              type: 'Canvas',
            },
            {
              id: 'https://test.com/iiif/test/canvas/2',
              type: 'Canvas',
            },
          ],
        },
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/2',
          index: -2,
        },
      });
      expect(newState.rootResource.items[0].id).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.rootResource.items[1].id).toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
    });
  });

  describe('LOAD_MANIFEST', () => {
    it('loads the manifest passed as a parameter', () => {
      const TEST_MANIFEST = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          'http://iiif.io/api/presentation/3/context.json',
        ],
        id: 'https://test.com/iiif/test/manifest',
        type: 'Manifest',
        label: {
          en: ['Untitled Manifest'],
        },
        items: [],
      };
      const state = {
        rootResource: null,
      };
      const newState = IIIFReducer(state, {
        type: 'LOAD_MANIFEST',
        options: {
          manifest: TEST_MANIFEST,
        },
      });
      expect(newState.rootResource['@context']).toEqual(
        TEST_MANIFEST['@context']
      );
      expect(newState.rootResource.type).toEqual(TEST_MANIFEST.type);
      expect(newState.rootResource.label).toEqual(TEST_MANIFEST.label);
      expect(newState.rootResource.items).toEqual(TEST_MANIFEST.items);
      expect(newState.rootResource.id).toEqual(TEST_MANIFEST.id);
    });
  });
});
