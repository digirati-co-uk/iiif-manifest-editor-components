# IIIF Manifest Editor Components


The project provides components to create editing tools for IIIF Manifests.

The following sub projects/npm packages handled under this repository:

@IIIF-MEC/core - core components for manifest editing
@IIIF-MEC/dlcs - dlcs extensions
@IIIF-MEC/collection-server-integration - collection server integration tools

Possible next packages:
@IIIF-MEC/presley-integration - in order to have "Super Sorting Room".


## Requirements and dependencies

- **nodejs** > 8.15.1
- **yarn** > 1.7.0
- **lerna** > 2.11.0

## Build the project locally:

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

## References

[nodejs.org](https://nodejs.org/en/download/)
[yarn](https://yarnpkg.com/en/docs/install)
[lerna](https://lernajs.io/)