import { Button, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { formatCommentDate, formatFullDate } from '../utils/date-helpers';
import { close as closeIcon } from '@wordpress/icons';

export default function CommentItem( { comment, isReply = false, onReply, onDelete, onResolve } ) {
	const currentUserId = window.postReviewCommentsData?.currentUser?.id;
	const canDelete = currentUserId === comment.author?.id;
	const isResolved = ! isReply && comment.resolved;

	return (
		<div className={ `comment-item ${ isReply ? 'is-reply' : '' } ${ isResolved ? 'is-resolved' : '' }` }>
			{ canDelete && onDelete && (
				<Button
					icon={ closeIcon }
					onClick={ () => {
						if ( window.confirm( __( 'Are you sure you want to delete this comment?', 'post-review-comments' ) ) ) {
							onDelete( comment.id );
						}
					} }
					className="comment-delete-button"
					label={ __( 'Delete', 'post-review-comments' ) }
					isSmall
				/>
			) }
			<Flex gap={ 2 } align="flex-start">
				{ comment.author?.avatar && (
					<FlexItem>
						<img
							src={ comment.author.avatar }
							alt={ comment.author.name }
							className="comment-avatar"
							width="32"
							height="32"
						/>
					</FlexItem>
				) }
				<FlexItem className="comment-content">
					<div className="comment-header">
						<strong>{ comment.author?.name || __( 'Unknown', 'post-review-comments' ) }</strong>
						<span className="comment-time">
							{ formatCommentDate( comment.timestamp ) }
						</span>
					</div>
					<div className="comment-body">
						{ comment.content }
					</div>
					<div className="comment-actions">
						{ ! isReply && onReply && (
							<Button
								variant="link"
								onClick={ () => onReply( comment.id ) }
								size="small"
								className="comment-action-reply"
							>
								<span className="action-icon">{ '\u2194' }</span>
								{ __( 'Reply', 'post-review-comments' ) }
							</Button>
						) }
						{ ! isReply && onResolve && (
							<Button
								variant="link"
								onClick={ () => onResolve( comment.id, ! comment.resolved ) }
								size="small"
								className="comment-action-resolve"
							>
								<span className="action-icon">
									{ comment.resolved ? '\u2611' : '\u2610' }
								</span>
								{ comment.resolved
									? __( 'Unresolve', 'post-review-comments' )
									: __( 'Resolve', 'post-review-comments' )
								}
							</Button>
						) }
					</div>
					<div className="comment-full-date">
						{ formatFullDate( comment.timestamp ) }
					</div>
				</FlexItem>
			</Flex>
		</div>
	);
}
