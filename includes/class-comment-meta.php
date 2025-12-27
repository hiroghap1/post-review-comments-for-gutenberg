<?php
/**
 * Post Review Comments Meta
 *
 * Handles post meta registration for comments
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Post_Review_Comments_Meta {

	/**
	 * Register post meta for comments
	 */
	public function register() {
		register_post_meta( '', '_post_review_comments', array(
			'show_in_rest' => array(
				'schema' => array(
					'type' => 'object',
					'properties' => array(
						'comments' => array(
							'type' => 'array',
							'items' => array(
								'type' => 'object',
							),
						),
						'version' => array(
							'type' => 'string',
						),
					),
				),
			),
			'single' => true,
			'type' => 'object',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
}
