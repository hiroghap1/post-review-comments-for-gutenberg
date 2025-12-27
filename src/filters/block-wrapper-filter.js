import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import classnames from 'classnames';
import { getBlockIdentifier } from '../utils/block-identifier';
import STORE_NAME from '../store';

/**
 * Add visual highlight to blocks with comments
 */
const withCommentHighlight = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { clientId } = props;

		const { hasComments, hasUnresolved } = useSelect(
			( select ) => {
				const blockEditorStore = select( 'core/block-editor' );
				const commentsStore = select( STORE_NAME );

				const blockId = getBlockIdentifier(
					clientId,
					blockEditorStore.getBlock,
					blockEditorStore.getBlocks
				);

				if ( ! blockId ) {
					return { hasComments: false, hasUnresolved: false };
				}

				return {
					hasComments: commentsStore.hasComments( blockId ),
					hasUnresolved: commentsStore.hasUnresolvedComments( blockId ),
				};
			},
			[ clientId ]
		);

		const className = classnames( props.className, {
			'has-block-comments': hasComments,
			'has-unresolved-comments': hasUnresolved,
		} );

		return <BlockListBlock { ...props } className={ className } />;
	};
}, 'withCommentHighlight' );

addFilter(
	'editor.BlockListBlock',
	'post-review-comments/add-highlight',
	withCommentHighlight
);
