import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';
import STORE_NAME from '../store';
import { formatCommentDate } from '../utils/date-helpers';

export default function CommentOverview() {
	const { allComments, unresolvedCount, totalCount } = useSelect( ( select ) => {
		const commentsStore = select( STORE_NAME );
		const comments = commentsStore.getAllComments();

		return {
			allComments: comments,
			unresolvedCount: commentsStore.getUnresolvedCount(),
			totalCount: commentsStore.getCommentCount(),
		};
	} );

	if ( ! allComments || allComments.length === 0 ) {
		return (
			<Notice status="info" isDismissible={ false }>
				{ __( 'No comments yet', 'post-review-comments' ) }
			</Notice>
		);
	}

	return (
		<div className="comment-overview">
			<div className="comment-stats">
				<p>
					<strong>{ totalCount }</strong> { __( 'total comments', 'post-review-comments' ) }
					{ ' · ' }
					<strong>{ unresolvedCount }</strong> { __( 'unresolved', 'post-review-comments' ) }
				</p>
			</div>

			<div className="comment-list">
				{ allComments.map( ( comment ) => (
					<div
						key={ comment.id }
						className={ `comment-overview-item ${ comment.resolved ? 'is-resolved' : 'is-unresolved' }` }
					>
						<div className="comment-overview-header">
							<span className="comment-status">
								{ comment.resolved ? '✓' : '○' }
							</span>
							<strong>{ comment.author?.name }</strong>
							<span className="comment-time">
								{ formatCommentDate( comment.timestamp ) }
							</span>
						</div>
						<div className="comment-overview-content">
							{ comment.content }
						</div>
						{ comment.replies && comment.replies.length > 0 && (
							<div className="comment-reply-count">
								{ comment.replies.length } { __( 'replies', 'post-review-comments' ) }
							</div>
						) }
					</div>
				) ) }
			</div>
		</div>
	);
}
