<?php
/**
 * Plugin Name:       Post Review Comments for Gutenberg
 * Description:       Add Word-like Review　& comment functionality to all Gutenberg blocks
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            HASEGAWA Yoshihiro
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       post-review-comments
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// Define plugin constants
define( 'POST_REVIEW_COMMENTS_VERSION', '1.0.0' );
define( 'POST_REVIEW_COMMENTS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'POST_REVIEW_COMMENTS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include dependencies
require_once POST_REVIEW_COMMENTS_PLUGIN_DIR . 'includes/class-comment-meta.php';
require_once POST_REVIEW_COMMENTS_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once POST_REVIEW_COMMENTS_PLUGIN_DIR . 'includes/class-capabilities.php';

/**
 * Enqueue block editor assets
 */
function post_review_comments_enqueue_block_editor_assets() {
	$asset_file = include( POST_REVIEW_COMMENTS_PLUGIN_DIR . 'build/index.asset.php' );

	wp_enqueue_script(
		'post-review-comments-editor',
		POST_REVIEW_COMMENTS_PLUGIN_URL . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Set script translations
	wp_set_script_translations(
		'post-review-comments-editor',
		'post-review-comments',
		POST_REVIEW_COMMENTS_PLUGIN_DIR . 'languages'
	);

	wp_enqueue_style(
		'post-review-comments-editor',
		POST_REVIEW_COMMENTS_PLUGIN_URL . 'build/index.css',
		array( 'wp-edit-blocks' ),
		$asset_file['version']
	);

	// Localize script with current user data
	$current_user = wp_get_current_user();
	wp_localize_script( 'post-review-comments-editor', 'postReviewCommentsData', array(
		'currentUser' => array(
			'id' => $current_user->ID,
			'name' => $current_user->display_name,
			'avatar' => get_avatar_url( $current_user->ID ),
		),
		'canComment' => current_user_can( 'edit_posts' ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'dateFormat' => get_option( 'date_format', 'Y年n月j日' ),
	) );
}
add_action( 'enqueue_block_editor_assets', 'post_review_comments_enqueue_block_editor_assets' );

/**
 * Load plugin textdomain
 */
function post_review_comments_load_textdomain() {
	load_plugin_textdomain(
		'post-review-comments',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'plugins_loaded', 'post_review_comments_load_textdomain' );

/**
 * Register post meta
 */
function post_review_comments_register_meta() {
	$meta = new Post_Review_Comments_Meta();
	$meta->register();
}
add_action( 'init', 'post_review_comments_register_meta' );

/**
 * Register REST API routes
 */
function post_review_comments_register_rest_routes() {
	$api = new Post_Review_Comments_REST_API();
	$api->register_routes();
}
add_action( 'rest_api_init', 'post_review_comments_register_rest_routes' );
