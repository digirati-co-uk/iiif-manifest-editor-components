

const saveAnnotatedZoom = manifest => {
    manifest.items[0].annotations = [{
        type: 'AnnotationPage',
        items: 
            manifest.items[0].items[0].items
                .filter(item => item.motivation === 'describing')
                // .map(item => 
                //     item.body.value.replace('<h2>', '<h2 class=\"annotatedzoom-annotation-detail__label\">')
                // )
    }];
    manifest.items[0].items[0].items = 
        manifest.items[0].items[0].items.filter(item => item.motivation !== 'describing')
    //console.log(manifest);
    return manifest;
};

const saveSlideshow = manifest => {
    return manifest;
};

export const saveFixtures = manifest => {
    const behaviors = manifest.behavior || [];
    const outputManifest = JSON.parse(JSON.stringify(manifest));
    if (behaviors.indexOf('vam-annotated-zoom') !== -1) {
        return saveAnnotatedZoom(outputManifest);
    } else if (behaviors.indexOf('vam-slideshow') !== -1) {
        return saveSlideshow(outputManifest);
    }
    return outputManifest;
};