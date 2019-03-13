

const saveAnnotatedZoom = manifest => {
    manifest.items[0].annotations = [{
        type: 'AnnotationPage',
        items: manifest.items[0].items[0].items.filter(item => item.motivation === 'describing')
    }];
    manifest.items[0].items[0].items = 
        manifest.items[0].items[0].items.filter(item => item.motivation !== 'describing')
};

const saveSlideshow = manifest => {
    
};

export const saveFixtures = manifest => {
    const behaviors = manifest.behavior || [];
    const outputManifest = JSON.parse(JSON.stringify(manifest));
    if (behaviors.indexOf('vam-annotated-zoom') !== -1) {
        saveAnnotatedZoom(outputManifest);
    } else if (behaviors.indexOf('vam-slideshow') !== -1) {
        saveSlideshow(outputManifest);
    }
    return outputManifest;
};