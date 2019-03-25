

const saveAnnotatedZoom = manifest => {
    manifest.items[0].annotations = [{
        type: 'AnnotationPage',
        items: 
            manifest.items[0].items[0].items
                .filter(item => item.motivation === 'describing')
    }];
    manifest.items[0].items[0].items = 
        manifest.items[0].items[0].items.filter(item => item.motivation !== 'describing')
    return manifest;
};

const saveSlideshow = manifest => {
    manifest.items[0].annotations = [{
        type: 'AnnotationPage',
        items: 
            manifest.items[0].items[0].items
                .filter(item => item.motivation === 'layout-viewport-focus')
    }];
    manifest.items[0].items[0].items = 
        manifest.items[0].items[0].items.filter(item => item.motivation !== 'layout-viewport-focus')
    return manifest;
};

export const saveFixtures = manifest => {
    if (!manifest) {
        return null;
    }
    const behaviors = manifest.behavior || [];
    const outputManifest = JSON.parse(JSON.stringify(manifest));
    if (behaviors.indexOf('vam-annotated-zoom') !== -1) {
        return saveAnnotatedZoom(outputManifest);
    } else if (behaviors.indexOf('vam-slideshow') !== -1) {
        return saveSlideshow(outputManifest);
    }
    return outputManifest;
};