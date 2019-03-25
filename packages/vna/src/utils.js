

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


export const transformSlideCanvas = canvas => {
    const canvasResult = JSON.parse(JSON.stringify(canvas));
    canvasResult.annotations = [{
        type: 'AnnotationPage',
        items: 
            canvas.items[0].items
                .filter(item => item.motivation === 'layout-viewport-focus')
    }];
    canvasResult.items[0].items = 
        canvas.items[0].items.filter(item => item.motivation !== 'layout-viewport-focus')
    return canvasResult;
}

const saveSlideshow = manifest => {
    manifest.items = manifest.items.map(canvas => {
        canvas.annotations = [{
            type: 'AnnotationPage',
            items: 
                canvas.items[0].items
                    .filter(item => item.motivation === 'layout-viewport-focus')
        }];
        canvas.items[0].items = 
            canvas.items[0].items.filter(item => item.motivation !== 'layout-viewport-focus')
        return canvas;
    });
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