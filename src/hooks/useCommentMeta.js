import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Custom hook to manage post meta for comments
 */
export default function useCommentMeta() {
	const { postType, postId, meta } = useSelect( ( select ) => {
		const editorStore = select( 'core/editor' );
		return {
			postType: editorStore.getCurrentPostType(),
			postId: editorStore.getCurrentPostId(),
			meta: editorStore.getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor' );

	const comments = meta?._post_review_comments || { comments: [], version: '1.0' };

	const updateComments = ( newComments ) => {
		editPost( {
			meta: {
				...meta,
				_post_review_comments: newComments,
			},
		} );
	};

	return {
		comments,
		updateComments,
		postId,
		postType,
	};
}
