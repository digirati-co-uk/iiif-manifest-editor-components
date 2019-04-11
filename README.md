# IIIF Manifest Editor Components


The project provides components to create editing tools for **IIIF Manifests**.


## Demos and Implementations

**Demo**

[https://iiif-manifest-editor-live-demo.netlify.com/](https://iiif-manifest-editor-live-demo.netlify.com/)


This [article](https://medium.com/digirati-ch/reaching-into-collections-to-tell-stories-3dc32a1772af) explains the motivation behind the following implementations.

**Victoria and Albert Museum - Slideshow and Annotated Zoom editor**

[https://vam-manifest-editor.netlify.com/](https://vam-manifest-editor.netlify.com/)

**Delft University of Technology - Exhibition Editor**

[https://delft-manifest-editor.netlify.com/](https://delft-manifest-editor.netlify.com/)


## Requirements and dependencies

- **nodejs** > 8.15.1
- **yarn** > 1.7.0
- **lerna** > 2.11.0

## Build the project locally

Clone the git repository:

```
git clone git@github.com:digirati-co-uk/iiif-manifest-editor-components.git
```

Install dependencies:

```
cd iiif-manifest-editor-components
yarn
```

The available build commands:

| command | description |
| --- | --- |
| build | build and lerna link |
| build-all | build only |
| build-ci | ci servers should use this command |
| start-docz | starts the core documentation server |
| link | lerna link |
| postinstall | lerna link |
| start | fesk-setup |

To simply build the package:

```
yarn build
```

To run the documentation:

```
yarn docz
```

## Configuring the property editor fields

The `src/defaults` folder contains manifest editor configurations for the specialized modes, namely the `annotated-zoom`, the `slideshow` and the `default` editor modes.

### Overriding property editor field labels

The form field label overrides defined as key-value pairs under the `metaOntology` property of the aforementioned defaults file. The following table lists all available keys.

| key | the overriden element |
|-----|-----------------------|
| Properties.[Annotation|Canvas|Manifest] | group title |
| [Manifest|Canvas|Annotation].Summary | summary field label |
| [Manifest|Canvas|Annotation].Label | label field label | 
| [Manifest|Canvas|Annotation].RequiredStatement | required statement field label |
| [Manifest|Canvas|Annotation].RequiredStatement.Label | required statement label field label |
| [Manifest|Canvas|Annotation].RequiredStatement.Value | required statement value field label |
| [Manifest|Canvas|Annotation].Metadata | metadata field label |
| [Manifest|Canvas|Annotation].Metadata.Label | metadata label field label |
| [Manifest|Canvas|Annotation].Metadata.Value | metadata value field label |
| [Manifest|Canvas|Annotation].Behaviors | behaviours field label |
| [Manifest].NavDate | manifest navdate field label |
| [Manifest].Rights | manifest rights field label |

The square brackets lists all possible values, so for example in the configuration you can have: 
```
{
  metaOntology: {
    'Manifest.Summary': 'Slideshow Summary',
    'Canvas.Summary': 'Slide Text',
    'Annotation.Summary': 'Annotation Summary',
  }
}
```

Note: please make sure that the field is enabled for the defaults `propertyFields` section as well.

### Changing the field order on the property editor forms

In the defaults defaults file `propertyFields` defines the editable IIIF properties in order of appearance udert the resource groups:   
```json
{
    Manifest: [
      ...
    ],
    Canvas: [
      ...
    ],
    Annotation: [
      ...
    ],
    TextPropertiesForm: [
      ...
    ],
    ImagePropertiesForm: [
      ...
    ],
 }
```

Where `...` is the IIIF property name. If a non-standard IIIF property name entered, a simple text field will appear. The list of iiif property names can be found at [https://iiif.io/api/presentation/3.0/#appendices](https://iiif.io/api/presentation/3.0/#appendices)

## References

[nodejs.org](https://nodejs.org/en/download/)

[yarn](https://yarnpkg.com/en/docs/install)

[lerna](https://lernajs.io/)
