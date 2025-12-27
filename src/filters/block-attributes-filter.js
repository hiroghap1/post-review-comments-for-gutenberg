import { addFilter } from '@wordpress/hooks';

/**
 * Add commentBlockId attribute to all blocks
 */
function addCommentAttributes( settings ) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			commentBlockId: {
				type: 'string',
				default: '',
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'post-review-comments/add-attributes',
	addCommentAttributes
);
