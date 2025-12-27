import apiFetch from '@wordpress/api-fetch';

/**
 * Set all comments
 */
export function setComments( comments, version ) {
	return {
		type: 'SET_COMMENTS',
		comments,
		version,
	};
}

/**
 * Add a comment
 */
export function addComment( comment ) {
	return {
		type: 'ADD_COMMENT',
		comment,
	};
}

/**
 * Update a comment
 */
export function updateComment( commentId, updates ) {
	return {
		type: 'UPDATE_COMMENT',
		commentId,
		updates,
	};
}

/**
 * Delete a comment
 */
export function deleteComment( commentId ) {
	return {
		type: 'DELETE_COMMENT',
		commentId,
	};
}

/**
 * Add a reply to a comment
 */
export function addReply( parentId, reply ) {
	return {
		type: 'ADD_REPLY',
		parentId,
		reply,
	};
}

/**
 * Set loading state
 */
export function setLoading( loading ) {
	return {
		type: 'SET_LOADING',
		loading,
	};
}

/**
 * Set error
 */
export function setError( error ) {
	return {
		type: 'SET_ERROR',
		error,
	};
}

/**
 * Create a new comment (async)
 */
export const createComment = ( postId, blockId, content, parentId = null ) => async ( { dispatch } ) => {
	dispatch( setLoading( true ) );

	try {
		const data = {
			blockId,
			content,
		};

		// Only include parentId if it's not null
		if ( parentId ) {
			data.parentId = parentId;
		}

		const response = await apiFetch( {
			path: `/post-review-comments/v1/posts/${ postId }/comments`,
			method: 'POST',
			data,
		} );

		if ( parentId ) {
			dispatch( addReply( parentId, response ) );
		} else {
			dispatch( addComment( response ) );
		}

		dispatch( setLoading( false ) );
		return response;
	} catch ( error ) {
		dispatch( setError( error.message ) );
		throw error;
	}
};

/**
 * Update a comment (async)
 */
export const updateCommentAsync = ( postId, commentId, updates ) => async ( { dispatch } ) => {
	dispatch( setLoading( true ) );

	try {
		const response = await apiFetch( {
			path: `/post-review-comments/v1/posts/${ postId }/comments/${ commentId }`,
			method: 'PUT',
			data: updates,
		} );

		dispatch( updateComment( commentId, updates ) );
		dispatch( setLoading( false ) );
		return response;
	} catch ( error ) {
		dispatch( setError( error.message ) );
		throw error;
	}
};

/**
 * Delete a comment (async)
 */
export const deleteCommentAsync = ( postId, commentId ) => async ( { dispatch } ) => {
	dispatch( setLoading( true ) );

	try {
		await apiFetch( {
			path: `/post-review-comments/v1/posts/${ postId }/comments/${ commentId }`,
			method: 'DELETE',
		} );

		dispatch( deleteComment( commentId ) );
		dispatch( setLoading( false ) );
	} catch ( error ) {
		dispatch( setError( error.message ) );
		throw error;
	}
};

/**
 * Resolve/unresolve a comment
 */
export const resolveComment = ( postId, commentId, resolved ) => async ( { dispatch } ) => {
	return await dispatch( updateCommentAsync( postId, commentId, { resolved } ) );
};
