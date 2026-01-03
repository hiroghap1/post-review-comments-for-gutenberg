<?php
/**
 * Post Review Comments REST API
 *
 * Handles REST API endpoints for comment CRUD operations
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Post_Review_Comments_REST_API {

	/**
	 * Register REST API routes
	 */
	public function register_routes() {
		$namespace = 'post-review-comments/v1';

		// Get all comments for a post
		register_rest_route( $namespace, '/posts/(?P<id>\d+)/comments', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_post_comments' ),
			'permission_callback' => array( $this, 'check_permission' ),
			'args' => array(
				'id' => array(
					'validate_callback' => function( $param ) {
						return is_numeric( $param );
					}
				),
			),
		) );

		// Add a new comment
		register_rest_route( $namespace, '/posts/(?P<id>\d+)/comments', array(
			'methods' => 'POST',
			'callback' => array( $this, 'create_comment' ),
			'permission_callback' => array( $this, 'check_permission' ),
			'args' => array(
				'blockId' => array(
					'required' => true,
					'type' => 'object',
				),
				'content' => array(
					'required' => true,
					'type' => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'parentId' => array(
					'type' => 'string',
					'default' => null,
				),
			),
		) );

		// Update a comment (edit or resolve)
		register_rest_route( $namespace, '/posts/(?P<id>\d+)/comments/(?P<commentId>[a-zA-Z0-9\-]+)', array(
			'methods' => 'PUT',
			'callback' => array( $this, 'update_comment' ),
			'permission_callback' => array( $this, 'check_permission' ),
			'args' => array(
				'content' => array(
					'type' => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'resolved' => array(
					'type' => 'boolean',
				),
			),
		) );

		// Delete a comment
		register_rest_route( $namespace, '/posts/(?P<id>\d+)/comments/(?P<commentId>[a-zA-Z0-9\-]+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this, 'delete_comment' ),
			'permission_callback' => array( $this, 'check_permission' ),
		) );
	}

	/**
	 * Check if user has permission to manage comments
	 *
	 * @param WP_REST_Request $request
	 * @return bool|WP_Error
	 */
	public function check_permission( $request ) {
		$post_id = $request->get_param( 'id' );

		// Check if user can edit the post
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to manage comments on this post.', 'post-review-comments' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Get all comments for a post
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_post_comments( $request ) {
		$post_id = $request->get_param( 'id' );
		$comments = get_post_meta( $post_id, '_post_review_comments', true );

		if ( empty( $comments ) ) {
			return rest_ensure_response( array( 'comments' => array(), 'version' => '1.0' ) );
		}

		return rest_ensure_response( $comments );
	}

	/**
	 * Create a new comment
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_comment( $request ) {
		$post_id = $request->get_param( 'id' );
		$block_id = $request->get_param( 'blockId' );
		$content = $request->get_param( 'content' );
		$parent_id = $request->get_param( 'parentId' );

		$comments_data = get_post_meta( $post_id, '_post_review_comments', true );
		if ( empty( $comments_data ) ) {
			$comments_data = array(
				'comments' => array(),
				'version' => '1.0'
			);
		}

		$current_user = wp_get_current_user();
		$new_comment = array(
			'id' => wp_generate_uuid4(),
			'blockId' => $block_id,
			'content' => $content,
			'author' => array(
				'id' => $current_user->ID,
				'name' => $current_user->display_name,
				'avatar' => get_avatar_url( $current_user->ID ),
			),
			'timestamp' => current_time( 'mysql' ),
			'resolved' => false,
			'replies' => array(),
		);

		// If this is a reply, add to parent's replies array
		if ( $parent_id ) {
			$found = false;
			foreach ( $comments_data['comments'] as &$comment ) {
				if ( $comment['id'] === $parent_id ) {
					$reply = array(
						'id' => wp_generate_uuid4(),
						'content' => $content,
						'author' => $new_comment['author'],
						'timestamp' => $new_comment['timestamp'],
					);
					$comment['replies'][] = $reply;
					$found = true;
					break;
				}
			}
			if ( ! $found ) {
				return new WP_Error(
					'parent_not_found',
					__( 'Parent comment not found.', 'post-review-comments' ),
					array( 'status' => 404 )
				);
			}
		} else {
			$comments_data['comments'][] = $new_comment;
		}

		update_post_meta( $post_id, '_post_review_comments', $comments_data );

		return rest_ensure_response( $new_comment );
	}

	/**
	 * Update a comment
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_comment( $request ) {
		$post_id = $request->get_param( 'id' );
		$comment_id = $request->get_param( 'commentId' );
		$content = $request->get_param( 'content' );
		$resolved = $request->get_param( 'resolved' );

		$comments_data = get_post_meta( $post_id, '_post_review_comments', true );
		if ( empty( $comments_data ) ) {
			return new WP_Error(
				'comments_not_found',
				__( 'No comments found.', 'post-review-comments' ),
				array( 'status' => 404 )
			);
		}

		$found = false;
		foreach ( $comments_data['comments'] as &$comment ) {
			if ( $comment['id'] === $comment_id ) {
				if ( $content !== null ) {
					$comment['content'] = $content;
				}
				if ( $resolved !== null ) {
					$comment['resolved'] = $resolved;
				}
				$found = true;
				$updated_comment = $comment;
				break;
			}
		}

		if ( ! $found ) {
			return new WP_Error(
				'comment_not_found',
				__( 'Comment not found.', 'post-review-comments' ),
				array( 'status' => 404 )
			);
		}

		update_post_meta( $post_id, '_post_review_comments', $comments_data );

		return rest_ensure_response( $updated_comment );
	}

	/**
	 * Delete a comment
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_comment( $request ) {
		$post_id = $request->get_param( 'id' );
		$comment_id = $request->get_param( 'commentId' );

		$comments_data = get_post_meta( $post_id, '_post_review_comments', true );
		if ( empty( $comments_data ) ) {
			return new WP_Error(
				'comments_not_found',
				__( 'No comments found.', 'post-review-comments' ),
				array( 'status' => 404 )
			);
		}

		$found = false;
		foreach ( $comments_data['comments'] as $index => $comment ) {
			if ( $comment['id'] === $comment_id ) {
				unset( $comments_data['comments'][$index] );
				$comments_data['comments'] = array_values( $comments_data['comments'] );
				$found = true;
				break;
			}
		}

		if ( ! $found ) {
			return new WP_Error(
				'comment_not_found',
				__( 'Comment not found.', 'post-review-comments' ),
				array( 'status' => 404 )
			);
		}

		update_post_meta( $post_id, '_post_review_comments', $comments_data );

		return rest_ensure_response( array( 'deleted' => true ) );
	}
}
