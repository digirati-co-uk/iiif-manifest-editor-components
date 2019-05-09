const saveAnnotatedZoom = manifest => {
  manifest.items[0].annotations = [
    {
      type: 'AnnotationPage',
      items: manifest.items[0].items[0].items
        .filter(item => item.motivation === 'describing')
        .map(item => {
          let credits = '';
          const itemCopy = JSON.parse(JSON.stringify(item));
          if (
            item.requiredStatement &&
            item.requiredStatement.value &&
            item.requiredStatement.value.en
          ) {
            const _credits = item.requiredStatement.value.en.join('\n');
            credits = `<p class="annotatedzoom-annotation-detail__credit">${_credits}</p>`;
            delete itemCopy.requiredStatement;
          }

          let title = '';
          if (item.label && item.label.en) {
            const _label = item.label.en.join('\n');
            title = `<h2 class="annotatedzoom-annotation-detail__label">${_label}</h2>`;
            delete itemCopy.label;
          }
          const value = (item.body.value || '').replace(
            /(?:\<p\>)?\<img([^>]+)>(?:\<\/p\>)?/g,
            (match, props) => {
              const imageProperties = (props.endsWith('/')
                ? props.substring(0, props.length - 1)
                : props
              )
                .trim()
                .split(/\s+/)
                .reduce((_props, kv) => {
                  const [k, v] = kv.split('=');
                  _props[k] = v;
                  return _props;
                }, {});
              imageProperties.class =
                '"annotatedzoom-annotation-detail__image"';
              const allProps = Object.entries(imageProperties)
                .map(kv => kv.join('='))
                .join(' ');
              return `<img ${allProps}/>`;
            }
          );
          itemCopy.body.value = `
            ${title}
            <div class="annotatedzoom-annotation-detail__content">
              ${value}
              ${credits}
            </div>
          `.replace(/\s+/g, ' ');
          return itemCopy;
        }),
    },
  ];
  manifest.items[0].items[0].items = manifest.items[0].items[0].items.filter(
    item => item.motivation !== 'describing'
  );
  return manifest;
};

export const transformSlideCanvas = canvas => {
  const canvasResult = JSON.parse(JSON.stringify(canvas));
  canvasResult.annotations = [
    {
      type: 'AnnotationPage',
      items: canvas.items[0].items.filter(
        item => item.motivation === 'layout-viewport-focus'
      ),
    },
  ];
  canvasResult.items[0].items = canvas.items[0].items.filter(
    item => item.motivation !== 'layout-viewport-focus'
  );
  return canvasResult;
};

const saveSlideshow = manifest => {
  manifest.items = manifest.items.map(transformSlideCanvas);
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

export const loadManifestHacks = manifest => {
  manifest.items = manifest.items.map(canvas => {
    if (canvas.annotations) {
      canvas.annotations.forEach(annotationPage => {
        if (annotationPage.items) {
          annotationPage.items = annotationPage.items.map(annotation => {
            if (annotation.body && annotation.body.value) {
              const inputData = annotation.body.value;
              const label = inputData.match(
                /(?:\<h2.*class=\"annotatedzoom-annotation-detail__label\">([^<]+)\<\/h2\>)/
              );

              const credit = inputData.match(
                /(?:\<p.*class=\"annotatedzoom-annotation-detail__credit\">([\w\W]+)\<\/p\>)/
              );

              const content = (credit
                ? inputData.replace(credit[0], '')
                : inputData
              ).match(
                /(?:\<div.*class=\"annotatedzoom-annotation-detail__content\">([\w\W]+)\<\/div\>)/
              );
              if (label || credit || content) {
                if (label) {
                  annotation.label = {
                    en: [label[1]],
                  };
                }
                if (credit) {
                  annotation.requiredStatement = {
                    label: {
                      en: ['Credit'],
                    },
                    value: {
                      en: [credit[1]],
                    },
                  };
                }

                if (content) {
                  annotation.body.value = content[1];
                }
              }
            }
            return annotation;
          });
        }
      });
    }
    return canvas;
  });
  return manifest;
};
