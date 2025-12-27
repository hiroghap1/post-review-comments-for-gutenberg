import { PanelBody, Notice } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { getBlockIdentifier, assignBlockIdentifier } from '../utils/block-identifier';
import STORE_NAME from '../store';
import CommentThread from './CommentThread';
import CommentForm from './CommentForm';

export default function CommentSidebar() {
	const { selectedBlockId, blockComments, selectedClientId } = useSelect( ( select ) => {
		const blockEditorStore = select( 'core/block-editor' );
		const commentsStore = select( STORE_NAME );
		const selectedClientId = blockEditorStore.getSelectedBlockClientId();

		if ( ! selectedClientId ) {
			return {
				selectedBlockId: null,
				blockComments: [],
				selectedClientId: null,
			};
		}

		const blockId = getBlockIdentifier(
			selectedClientId,
			blockEditorStore.getBlock,
			blockEditorStore.getBlocks
		);

		const comments = blockId ? commentsStore.getCommentsForBlock( blockId ) : [];

		return {
			selectedBlockId: blockId,
			blockComments: comments,
			selectedClientId,
		};
	} );

	const { createComment, deleteCommentAsync, resolveComment } = useDispatch( STORE_NAME );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const postId = useSelect( ( select ) => select( 'core/editor' ).getCurrentPostId() );

	const handleCommentSubmit = async ( content ) => {
		// Ensure block has a stable ID
		const blockEditorStore = wp.data.select( 'core/block-editor' );
		const block = blockEditorStore.getBlock( selectedClientId );

		let blockId = selectedBlockId;
		if ( ! block.attributes?.commentBlockId && ! block.attributes?.anchor ) {
			blockId = assignBlockIdentifier( selectedClientId, updateBlockAttributes );
		}

		await createComment( postId, blockId, content );
	};

	const handleReply = async ( content, parentId ) => {
		await createComment( postId, selectedBlockId, content, parentId );
	};

	const handleDelete = async ( commentId ) => {
		if ( confirm( __( 'Are you sure you want to delete this comment?', 'post-review-comments' ) ) ) {
			await deleteCommentAsync( postId, commentId );
		}
	};

	const handleResolve = async ( commentId, resolved ) => {
		await resolveComment( postId, commentId, resolved );
	};

	if ( ! selectedBlockId ) {
		return (
			<PanelBody>
				<Notice status="info" isDismissible={ false }>
					{ __( 'Select a block to view or add comments', 'post-review-comments' ) }
				</Notice>
			</PanelBody>
		);
	}

	return (
		<PanelBody>
			<CommentThread
				comments={ blockComments }
				blockId={ selectedBlockId }
				onReply={ handleReply }
				onDelete={ handleDelete }
				onResolve={ handleResolve }
			/>
			<CommentForm
				blockId={ selectedBlockId }
				mode="new"
				onSubmit={ handleCommentSubmit }
			/>
		</PanelBody>
	);
}
