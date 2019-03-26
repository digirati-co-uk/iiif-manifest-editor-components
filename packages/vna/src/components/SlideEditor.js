import React from 'react';

import {
    Manifest,
    Fullscreen,
    RangeNavigationProvider,
    //withBemClass,
    //Responsive,
	} from '@canvas-panel/core';
	
import { transformSlideCanvas } from '../utils';

import { Slide } from '@canvas-panel/slideshow';

const SlideEditor = ({ manifestJSON, canvasId }) => {
	// Dumb way to update after edit, sorry, deadlines...
	let manifestJSONLD = canvasId ? {
		'@context': [
			"http://www.w3.org/ns/anno.jsonld",
			"http://iiif.io/api/presentation/3/context.json"
		],
		id: 'manifest_' + new Date().getTime(),
		type: 'Manifest',
		items: JSON.parse(
			JSON.stringify(
				(manifestJSON.items || [])
					.filter(canvas=> canvas.id === canvasId)
					.map(transformSlideCanvas)
			)
		)
	}: null;
	if (manifestJSONLD && manifestJSONLD.items && manifestJSON.items.length> 0) {
		manifestJSONLD.items[0].id = 'cnvs_' + new Date().getTime();
		// this is a hack, first thing to remove,
		// the modification requires to retrofit delft as well.
		try {
			// console.log(
			// 	'manifestJSONLD.items[0].items[0].items[0]',
			// 	manifestJSONLD.items[0].items[0].items[0]
			// )

		} catch (err) {}
		if (
			manifestJSONLD.items &&
			manifestJSONLD.items.length &&
			manifestJSONLD.items[0] && 
			manifestJSONLD.items[0].items.length &&
			manifestJSONLD.items[0].items[0] && 
			manifestJSONLD.items[0].items[0].items.length &&
			manifestJSONLD.items[0].items[0].items[0] && 
			manifestJSONLD.items[0].items[0].items[0].body && 
			manifestJSONLD.items[0].items[0].items[0].body.service && 
			!Array.isArray(manifestJSONLD.items[0].items[0].items[0].body.service)
		) {
			manifestJSONLD.items[0].items[0].items[0].body.service.type = "ImageService2";
			manifestJSONLD.items[0].items[0].items[0].body.service.profile = "level1";
			manifestJSONLD.items[0].items[0].items[0].body.service = [manifestJSONLD.items[0].items[0].items[0].body.service];
		}
	}
	return canvasId ? (
		<div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
		<Manifest key={manifestJSONLD.id} jsonLd={manifestJSONLD}>
			<RangeNavigationProvider currentIndex={0}>
				{rangeProps => {
					const {
						manifest,
						canvas,
						canvasList,
						currentIndex,
						previousRange,
						nextRange,
						region,
					} = rangeProps;
					// console.log(
					// 	'RangeNavigationProvider',
					// 	manifest,
					// 	canvas,
					// 	region,
					// )
					return (
						<Slide
							fullscreenProps={{
								isFullscreen: false
							}}
							behaviors={canvas.__jsonld.behavior || []}
							manifest={manifest}
							canvas={canvas}
							region={region}
						/>
					);
				}}
			</RangeNavigationProvider>
		</Manifest>
		</div>
	) : (
		'Please select a slide to edit'
	);
}

export default SlideEditor;