import { createHigherOrderComponent } from '@wordpress/compose';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { comment as commentIcon } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { getBlockIdentifier, assignBlockIdentifier } from '../utils/block-identifier';
import STORE_NAME from '../store';

/**
 * Add comment button to block toolbar
 */
const withCommentButton = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId } = props;

		const { hasComments, commentCount, canComment } = useSelect(
			( select ) => {
				const blockEditorStore = select( 'core/block-editor' );
				const commentsStore = select( STORE_NAME );

				const blockId = getBlockIdentifier(
					clientId,
					blockEditorStore.getBlock,
					blockEditorStore.getBlocks
				);

				const comments = blockId ? commentsStore.getCommentsForBlock( blockId ) : [];

				return {
					hasComments: comments.length > 0,
					commentCount: comments.length,
					canComment: window.postReviewCommentsData?.canComment || false,
				};
			},
			[ clientId ]
		);

		const { openGeneralSidebar } = useDispatch( 'core/edit-post' );
		const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

		const handleCommentClick = () => {
			// Ensure block has a stable ID
			const blockEditorStore = wp.data.select( 'core/block-editor' );
			const block = blockEditorStore.getBlock( clientId );

			if ( ! block.attributes?.commentBlockId && ! block.attributes?.anchor ) {
				assignBlockIdentifier( clientId, updateBlockAttributes );
			}

			// Open comment sidebar
			openGeneralSidebar( 'post-review-comments-for-gutenberg/post-review-comments-sidebar' );
		};

		if ( ! canComment ) {
			return <BlockEdit { ...props } />;
		}

		const label = hasComments
			? sprintf( __( '%d Comments', 'post-review-comments' ), commentCount )
			: __( 'Add Comment', 'post-review-comments' );

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<BlockControls group="other">
					<ToolbarGroup>
						<ToolbarButton
							icon={ commentIcon }
							label={ label }
							onClick={ handleCommentClick }
							isPressed={ hasComments }
							className={ hasComments ? 'has-comments-badge' : '' }
						>
							{ hasComments && (
								<span className="comment-count-badge">{ commentCount }</span>
							) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			</Fragment>
		);
	};
}, 'withCommentButton' );

addFilter(
	'editor.BlockEdit',
	'post-review-comments/add-comment-button',
	withCommentButton
);
