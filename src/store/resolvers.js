import apiFetch from '@wordpress/api-fetch';

/**
 * Resolver to fetch comments for a post
 */
export async function getAllComments() {
	const postId = wp.data.select( 'core/editor' ).getCurrentPostId();

	if ( ! postId ) {
		return;
	}

	const { setComments, setError, setLoading } = wp.data.dispatch( 'post-review-comments/store' );

	setLoading( true );

	try {
		const response = await apiFetch( {
			path: `/post-review-comments/v1/posts/${ postId }/comments`,
		} );

		setComments( response.comments || [], response.version );
	} catch ( error ) {
		setError( error.message );
	}
}
