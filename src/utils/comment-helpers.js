/**
 * Filter comments by block ID
 * @param {Array} comments All comments
 * @param {Object} blockId Block identifier
 * @returns {Array} Comments for the specified block
 */
export function getCommentsForBlock( comments, blockId ) {
	if ( ! comments || ! blockId ) {
		return [];
	}

	return comments.filter( ( comment ) => {
		return comment.blockId &&
		       comment.blockId.type === blockId.type &&
		       comment.blockId.value === blockId.value;
	} );
}

/**
 * Check if a block has comments
 * @param {Array} comments All comments
 * @param {Object} blockId Block identifier
 * @returns {boolean} True if block has comments
 */
export function hasBlockComments( comments, blockId ) {
	const blockComments = getCommentsForBlock( comments, blockId );
	return blockComments.length > 0;
}

/**
 * Check if a block has unresolved comments
 * @param {Array} comments All comments
 * @param {Object} blockId Block identifier
 * @returns {boolean} True if block has unresolved comments
 */
export function hasUnresolvedComments( comments, blockId ) {
	const blockComments = getCommentsForBlock( comments, blockId );
	return blockComments.some( ( comment ) => ! comment.resolved );
}

/**
 * Get total reply count for a comment
 * @param {Object} comment Comment object
 * @returns {number} Number of replies
 */
export function getReplyCount( comment ) {
	return comment.replies ? comment.replies.length : 0;
}

/**
 * Get all unresolved comments
 * @param {Array} comments All comments
 * @returns {Array} Unresolved comments
 */
export function getUnresolvedComments( comments ) {
	if ( ! comments ) {
		return [];
	}
	return comments.filter( ( comment ) => ! comment.resolved );
}
