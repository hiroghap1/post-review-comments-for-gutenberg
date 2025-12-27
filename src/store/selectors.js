import { getCommentsForBlock as filterCommentsByBlock, hasUnresolvedComments as checkUnresolvedComments } from '../utils/comment-helpers';

/**
 * Get all comments
 */
export function getAllComments( state ) {
	return state.comments || [];
}

/**
 * Get comments for a specific block
 */
export function getCommentsForBlock( state, blockId ) {
	return filterCommentsByBlock( state.comments, blockId );
}

/**
 * Get a specific comment by ID
 */
export function getCommentById( state, commentId ) {
	return state.comments.find( ( comment ) => comment.id === commentId );
}

/**
 * Get all unresolved comments
 */
export function getUnresolvedComments( state ) {
	return state.comments.filter( ( comment ) => ! comment.resolved );
}

/**
 * Check if a block has comments
 */
export function hasComments( state, blockId ) {
	const comments = getCommentsForBlock( state, blockId );
	return comments.length > 0;
}

/**
 * Check if a block has unresolved comments
 */
export function hasUnresolvedComments( state, blockId ) {
	return checkUnresolvedComments( state.comments, blockId );
}

/**
 * Get loading state
 */
export function isLoading( state ) {
	return state.loading;
}

/**
 * Get error
 */
export function getError( state ) {
	return state.error;
}

/**
 * Get total comment count
 */
export function getCommentCount( state ) {
	return state.comments.length;
}

/**
 * Get unresolved comment count
 */
export function getUnresolvedCount( state ) {
	return getUnresolvedComments( state ).length;
}
