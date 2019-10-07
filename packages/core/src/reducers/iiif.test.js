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
        resources: {},
        rootResource: null,
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          type: 'Manifest',
        },
      });
      expect(newState.rootResource).toEqual(
        newState.resources[newState.rootResource].id
      );
      expect(newState.resources[newState.rootResource].type).toEqual(TEST_MANIFEST.type);
      expect(newState.resources[newState.rootResource].label).toEqual(TEST_MANIFEST.label);
      expect(newState.resources[newState.rootResource].items).toEqual(TEST_MANIFEST.items);
    });

    it('is adding resource to the resource id passed as string in the options.parent', () => {
      const manifest = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          'http://iiif.io/api/presentation/3/context.json',
        ],
        id: 'https://test.com/iiif/test/manifest',
        '@id': 'https://test.com/iiif/test/manifest',
        type: 'Manifest',
        label: {
          en: ['Untitled Manifest'],
        },
        items: [],
      };
      const state = {
        resources: {
          [manifest.id]: manifest
        },
        rootResource: manifest.id,
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
      };
      const newState = IIIFReducer(state, {
        type: 'ADD_RESOURCE',
        options: {
          parent: 'https://test.com/iiif/test/manifest',
          type: 'Canvas',
        },
      });
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource).not.toBeNull();
      expect(manifestResource.items).toHaveLength(1);
      expect(newState.resources[manifestResource.items[0]]).toHaveProperty('type');
      expect(newState.resources[manifestResource.items[0]].type).toEqual('Canvas');
    });

    it('is adding resource to the resource passed as options.parent', () => {
      const manifest = {
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
        resources: {
          [manifest.id]: manifest
        },
        rootResource: manifest.id,
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
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
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource).not.toBeNull();
      expect(manifestResource.items).toHaveLength(1);
      expect(newState.resources[manifestResource.items[0]]).toHaveProperty('type');
      expect(newState.resources[manifestResource.items[0]].type).toEqual('Canvas');
    });

    it('is able to override properties coming from options.props', () => {
      const state = {
        resources: {},
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
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource).not.toBe(null);
      expect(manifestResource.label.en).toEqual(['test manifest label']);
      expect(manifestResource.metadata).toHaveLength(1);
      expect(manifestResource.metadata[0].label.en).toEqual(['Creator']);
      expect(manifestResource.metadata[0].value.en).toEqual([
        'Jester The Tester',
      ]);
    });

    it('adds the resource at the specific index', () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
            'https://test.com/iiif/test/canvas/1': {
              id: 'https://test.com/iiif/test/canvas/1',
              '@id': 'https://test.com/iiif/test/canvas/1',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            },
            'https://test.com/iiif/test/canvas/2': {
              id: 'https://test.com/iiif/test/canvas/2',
              '@id': 'https://test.com/iiif/test/canvas/2',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            }
          }
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
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
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource.items).toHaveLength(3);
      expect(manifestResource.items[1]).not.toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[manifestResource.items[1]].type).toEqual('Canvas');
      expect(newState.resources[manifestResource.items[1]].label.en).toEqual(['test canvas']);
    });

    it("if the specified index is larger than the target resource's items size it adds the item at the last position", () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
            'https://test.com/iiif/test/canvas/1': {
              id: 'https://test.com/iiif/test/canvas/1',
              '@id': 'https://test.com/iiif/test/canvas/1',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            },
            'https://test.com/iiif/test/canvas/2': {
              id: 'https://test.com/iiif/test/canvas/2',
              '@id': 'https://test.com/iiif/test/canvas/2',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            }
          }
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
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
          index: 3,
        },
      });
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource.items).toHaveLength(3);
      expect(manifestResource.items[2]).not.toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[manifestResource.items[2]].type).toEqual('Canvas');
      expect(newState.resources[manifestResource.items[2]].label.en).toEqual(['test canvas']);
    });

    it("negative indexes are included as the first item in the resource's collection ", () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
            'https://test.com/iiif/test/canvas/1': {
              id: 'https://test.com/iiif/test/canvas/1',
              '@id': 'https://test.com/iiif/test/canvas/1',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            },
            'https://test.com/iiif/test/canvas/2': {
              id: 'https://test.com/iiif/test/canvas/2',
              '@id': 'https://test.com/iiif/test/canvas/2',
              '@parent': 'https://test.com/iiif/test/manifest',
              type: 'Canvas',
            }
          }
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
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
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource.items).toHaveLength(3);
      expect(manifestResource.items[0]).not.toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[manifestResource.items[0]].type).toEqual('Canvas');
      expect(newState.resources[manifestResource.items[0]].label.en).toEqual(['test canvas']);
    });

    //TODO: it throws error if no rootResource in the state?
  });

  describe('REMOVE_RESOURCE', () => {
    it('removes the specified resource id from the project resources', () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
          },
          'https://test.com/iiif/test/canvas/1': {
            id: 'https://test.com/iiif/test/canvas/1',
            '@id': 'https://test.com/iiif/test/canvas/1',
            '@parent': 'https://test.com/iiif/test/manifest',
            type: 'Canvas',
          },
          'https://test.com/iiif/test/canvas/2': {
            id: 'https://test.com/iiif/test/canvas/2',
            '@id': 'https://test.com/iiif/test/canvas/2',
            '@parent': 'https://test.com/iiif/test/manifest',
            type: 'Canvas',
          }
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          Annotation: null,
          Canvas: null,
        }
      };
      const newState = IIIFReducer(state, {
        type: 'REMOVE_RESOURCE',
        id: 'https://test.com/iiif/test/canvas/1',
      });
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource.items).toHaveLength(1);
      expect(manifestResource.items[0]).not.toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
      expect(manifestResource.items[0]).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
    });

    it('removes the specified resource id under a certain parent', () => {
      const state = {
        "resources": {
          "https://test.com/iiif/test/manifest": {
            "@context": [
              "http://www.w3.org/ns/anno.jsonld",
              "http://iiif.io/api/presentation/3/context.json"
            ],
            "id": "https://test.com/iiif/test/manifest",
            "type": "Manifest",
            "label": {
              "en": [
                "Untitled Manifest"
              ]
            },
            "items": [
              "https://test.com/iiif/test/canvas/1",
              "https://test.com/iiif/test/canvas/2"
            ],
            "@id": "https://test.com/iiif/test/manifest"
          },
          "https://test.com/iiif/test/canvas/1": {
            "id": "https://test.com/iiif/test/canvas/1",
            "type": "Canvas",
            "items": [
              "https://test.com/iiif/test/list/1"
            ],
            "@id": "https://test.com/iiif/test/canvas/1",
            "@parent": "https://test.com/iiif/test/manifest"
          },
          "https://test.com/iiif/test/list/1": {
            "id": "https://test.com/iiif/test/list/1",
            "type": "AnnotationList",
            "items": [
              "https://test.com/iiif/test/annotation/1",
              "https://test.com/iiif/test/annotation/2"
            ],
            "@id": "https://test.com/iiif/test/list/1",
            "@parent": "https://test.com/iiif/test/canvas/1"
          },
          "https://test.com/iiif/test/annotation/1": {
            "id": "https://test.com/iiif/test/annotation/1",
            "type": "Annotation",
            "target": "https://test.com/iiif/test/canvas/1",
            "body": {
              "type": "TextualBody",
              "id": "https://test.com/iiif/test/textualbody/45fc1dee-00b6-be8e-b382-a300390a5ab5"
            },
            "@id": "https://test.com/iiif/test/annotation/1",
            "@parent": "https://test.com/iiif/test/list/1"
          },
          "https://test.com/iiif/test/annotation/2": {
            "id": "https://test.com/iiif/test/annotation/2",
            "type": "Annotation",
            "motivation": "painting",
            "target": "https://test.com/iiif/test/canvas/1",
            "body": {
              "type": "TextualBody",
              "id": "https://test.com/iiif/test/textualbody/866dadb8-7702-dbbe-29b2-44034390bbd2"
            },
            "@id": "https://test.com/iiif/test/annotation/2",
            "@parent": "https://test.com/iiif/test/list/1"
          },
          "https://test.com/iiif/test/canvas/2": {
            "id": "https://test.com/iiif/test/canvas/2",
            "type": "Canvas",
            "items": [
              "https://test.com/iiif/test/list/3"
            ],
            "@id": "https://test.com/iiif/test/canvas/2",
            "@parent": "https://test.com/iiif/test/manifest"
          },
          "https://test.com/iiif/test/list/3": {
            "id": "https://test.com/iiif/test/list/3",
            "type": "AnnotationList",
            "items": [
              "https://test.com/iiif/test/annotation/3",
              "https://test.com/iiif/test/annotation/4"
            ],
            "@id": "https://test.com/iiif/test/list/3",
            "@parent": "https://test.com/iiif/test/canvas/2"
          },
          "https://test.com/iiif/test/annotation/3": {
            "id": "https://test.com/iiif/test/annotation/3",
            "type": "Annotation",
            "motivation": "painting",
            "target": "https://test.com/iiif/test/canvas/2",
            "body": {
              "type": "TextualBody",
              "id": "https://test.com/iiif/test/textualbody/28955870-4153-eadf-f280-5620898aa876"
            },
            "@id": "https://test.com/iiif/test/annotation/3",
            "@parent": "https://test.com/iiif/test/list/3"
          },
          "https://test.com/iiif/test/annotation/4": {
            "id": "https://test.com/iiif/test/annotation/4",
            "type": "Annotation",
            "motivation": "describing",
            "target": "https://test.com/iiif/test/canvas/2",
            "body": {
              "type": "TextualBody",
              "id": "https://test.com/iiif/test/textualbody/b62f494d-a2cb-3e53-86b8-576374c426ca"
            },
            "@id": "https://test.com/iiif/test/annotation/4",
            "@parent": "https://test.com/iiif/test/list/3"
          }
        },
        "rootResource": "https://test.com/iiif/test/manifest",
        "selectedIdsByType": {
          "Canvas": "https://test.com/iiif/test/canvas/1",
          "Annotation": null
        },
        "lang": "en",
        "loadManifestDialogOpen": false,
        "loadManifestDialogOpen2": false,
        "saveManifestDialogOpen": false,
        "previewModalOpen": false
      }
      const newState = IIIFReducer(state, {
        type: 'REMOVE_RESOURCE',
        id: 'https://test.com/iiif/test/annotation/1',
        parent: 'https://test.com/iiif/test/list/1',
      });

      const listResource = newState.resources['https://test.com/iiif/test/list/1'];
      expect(listResource.items).toHaveLength(1);
    });
  });

  describe('UPDATE_RESOURCE', () => {
    it('updates the passed resource', () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
          }
        },
        rootResource: 'https://test.com/iiif/test/manifest',
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
      expect(newState.resources[newState.rootResource].label.en).toEqual(['test label']);
    });
  });

  describe('UPDATE_RESOURCE_ORDER', () => {
    it("moves the resource to a the passed index on it's parent", () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
          },
          'https://test.com/iiif/test/canvas/1': {
            id: 'https://test.com/iiif/test/canvas/1',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
          'https://test.com/iiif/test/canvas/2': {
            id: 'https://test.com/iiif/test/canvas/2',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          "Canvas": "https://test.com/iiif/test/canvas/1",
          "Annotation": null
        }
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/2',
          startIndex: 1,
          targetIndex: 0,
        },
      });
      expect(newState.resources[newState.rootResource].items[0]).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[newState.rootResource].items[1]).toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
    });

    it("moves the resource to a the last index on it's parent if the index is larger than the number of contained resources on the parent", () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
          },
          'https://test.com/iiif/test/canvas/1': {
            id: 'https://test.com/iiif/test/canvas/1',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
          'https://test.com/iiif/test/canvas/2': {
            id: 'https://test.com/iiif/test/canvas/2',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          "Canvas": "https://test.com/iiif/test/canvas/1",
          "Annotation": null
        }
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/2',
          startIndex: 0,
          targetIndex: 3,
        },
      });
      expect(newState.resources[newState.rootResource].items[0]).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[newState.rootResource].items[1]).toEqual(
        'https://test.com/iiif/test/canvas/1'
      );
    });
    it("negative indexes are interpreted as the first item in the resource's collection ", () => {
      const state = {
        resources: {
          'https://test.com/iiif/test/manifest': {
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
              'https://test.com/iiif/test/canvas/1',
              'https://test.com/iiif/test/canvas/2',
            ],
          },
          'https://test.com/iiif/test/canvas/1': {
            id: 'https://test.com/iiif/test/canvas/1',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
          'https://test.com/iiif/test/canvas/2': {
            id: 'https://test.com/iiif/test/canvas/2',
            type: 'Canvas',
            '@parent': 'https://test.com/iiif/test/manifest',
          },
        },
        rootResource: 'https://test.com/iiif/test/manifest',
        selectedIdsByType: {
          "Canvas": "https://test.com/iiif/test/canvas/1",
          "Annotation": null
        }
      };
      const newState = IIIFReducer(state, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: 'https://test.com/iiif/test/canvas/2',
          startIndex: 1,
          targetIndex: -2,
        },
      });
      expect(newState.resources[newState.rootResource].items[0]).toEqual(
        'https://test.com/iiif/test/canvas/2'
      );
      expect(newState.resources[newState.rootResource].items[1]).toEqual(
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
        resources: {},
        rootResource: null,
        selectedIdsByType: {
          "Canvas": "https://test.com/iiif/test/canvas/1",
          "Annotation": null
        }
      };
      const newState = IIIFReducer(state, {
        type: 'LOAD_MANIFEST',
        manifest: TEST_MANIFEST,
      });
      const manifestResource = newState.resources[newState.rootResource];
      expect(manifestResource['@context']).toEqual(
        TEST_MANIFEST['@context']
      );
      expect(manifestResource.type).toEqual(TEST_MANIFEST.type);
      expect(manifestResource.label).toEqual(TEST_MANIFEST.label);
      expect(manifestResource.items).toHaveLength(TEST_MANIFEST.items.length);
      expect(manifestResource.id).toEqual(TEST_MANIFEST.id);
    });
  });
});
