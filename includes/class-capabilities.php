<?php
/**
 * Post Review Comments Capabilities
 *
 * Handles user capability checks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Post_Review_Comments_Capabilities {

	/**
	 * Check if user can comment on a post
	 *
	 * @param int $user_id User ID
	 * @param int $post_id Post ID
	 * @return bool
	 */
	public function can_user_comment( $user_id, $post_id ) {
		return user_can( $user_id, 'edit_posts' ) &&
		       user_can( $user_id, 'edit_post', $post_id );
	}

	/**
	 * Check if user can delete a comment
	 *
	 * @param int $user_id User ID
	 * @param int $comment_author_id Comment author ID
	 * @return bool
	 */
	public function can_user_delete_comment( $user_id, $comment_author_id ) {
		// Users can delete their own comments or if they can edit others' posts
		return $user_id === $comment_author_id ||
		       user_can( $user_id, 'edit_others_posts' );
	}

	/**
	 * Check if user can resolve a comment
	 *
	 * @param int $user_id User ID
	 * @param int $post_id Post ID
	 * @return bool
	 */
	public function can_user_resolve_comment( $user_id, $post_id ) {
		// Any user who can edit the post can resolve comments
		return user_can( $user_id, 'edit_post', $post_id );
	}
}
