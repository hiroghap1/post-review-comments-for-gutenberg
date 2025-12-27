import { useSelect, useDispatch } from '@wordpress/data';
import STORE_NAME from '../store';

/**
 * Custom hook to manage comments
 */
export default function useComments( blockId = null ) {
	const { comments, loading, error } = useSelect(
		( select ) => {
			const commentsStore = select( STORE_NAME );

			return {
				comments: blockId
					? commentsStore.getCommentsForBlock( blockId )
					: commentsStore.getAllComments(),
				loading: commentsStore.isLoading(),
				error: commentsStore.getError(),
			};
		},
		[ blockId ]
	);

	const { createComment, deleteCommentAsync, resolveComment } = useDispatch( STORE_NAME );
	const postId = useSelect( ( select ) => select( 'core/editor' ).getCurrentPostId() );

	const addComment = async ( content, parentId = null ) => {
		return await createComment( postId, blockId, content, parentId );
	};

	const deleteComment = async ( commentId ) => {
		return await deleteCommentAsync( postId, commentId );
	};

	const toggleResolve = async ( commentId, resolved ) => {
		return await resolveComment( postId, commentId, resolved );
	};

	return {
		comments,
		loading,
		error,
		addComment,
		deleteComment,
		toggleResolve,
	};
}
