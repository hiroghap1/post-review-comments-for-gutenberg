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
		return 'Just now';
	} else if ( diffMins < 60 ) {
		return `${ diffMins } minute${ diffMins > 1 ? 's' : '' } ago`;
	} else if ( diffHours < 24 ) {
		return `${ diffHours } hour${ diffHours > 1 ? 's' : '' } ago`;
	} else if ( diffDays < 7 ) {
		return `${ diffDays } day${ diffDays > 1 ? 's' : '' } ago`;
	} else {
		return date.toLocaleDateString();
	}
}

/**
 * Get relative time string
 * @param {string} timestamp ISO timestamp
 * @returns {string} Relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime( timestamp ) {
	return formatCommentDate( timestamp );
}
