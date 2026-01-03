import { __, sprintf } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';

/**
 * Format timestamp for display
 * @param {string} timestamp ISO timestamp
 * @returns {string} Formatted date string
 */
export function formatCommentDate( timestamp ) {
	const date = new Date( timestamp );
	const now = new Date();
	const diffMs = now - date;
	const diffMins = Math.floor( diffMs / 60000 );
	const diffHours = Math.floor( diffMs / 3600000 );
	const diffDays = Math.floor( diffMs / 86400000 );

	if ( diffMins < 1 ) {
		return __( 'Just now', 'post-review-comments' );
	} else if ( diffMins < 60 ) {
		return sprintf(
			__( '%d minutes ago', 'post-review-comments' ),
			diffMins
		);
	} else if ( diffHours < 24 ) {
		return sprintf(
			__( '%d hours ago', 'post-review-comments' ),
			diffHours
		);
	} else if ( diffDays < 7 ) {
		return sprintf(
			__( '%d days ago', 'post-review-comments' ),
			diffDays
		);
	} else {
		return date.toLocaleDateString( 'ja-JP' );
	}
}

/**
 * Format timestamp using WordPress date format
 * @param {string} timestamp ISO timestamp
 * @returns {string} Formatted date string using WordPress settings
 */
export function formatFullDate( timestamp ) {
	const dateFormat = window.postReviewCommentsData?.dateFormat || 'Y年n月j日';
	return dateI18n( dateFormat, timestamp );
}

/**
 * Get relative time string
 * @param {string} timestamp ISO timestamp
 * @returns {string} Relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime( timestamp ) {
	return formatCommentDate( timestamp );
}
