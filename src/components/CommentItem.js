import { Button, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { formatCommentDate } from '../utils/date-helpers';

export default function CommentItem( { comment, isReply = false, onReply, onDelete, onResolve } ) {
	const currentUserId = window.postReviewCommentsData?.currentUser?.id;
	const canDelete = currentUserId === comment.author?.id;

	return (
		<div className={ `comment-item ${ isReply ? 'is-reply' : '' }` }>
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
							>
								{ __( 'Reply', 'post-review-comments' ) }
							</Button>
						) }
						{ ! isReply && onResolve && (
							<Button
								variant="link"
								onClick={ () => onResolve( comment.id, ! comment.resolved ) }
								size="small"
							>
								{ comment.resolved
									? __( 'Unresolve', 'post-review-comments' )
									: __( 'Resolve', 'post-review-comments' )
								}
							</Button>
						) }
						{ canDelete && onDelete && (
							<Button
								variant="link"
								onClick={ () => onDelete( comment.id ) }
								size="small"
								isDestructive
							>
								{ __( 'Delete', 'post-review-comments' ) }
							</Button>
						) }
					</div>
				</FlexItem>
			</Flex>
		</div>
	);
}
