import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

export default function CommentThread( { comments, blockId, onReply, onDelete, onResolve } ) {
	const [ replyingTo, setReplyingTo ] = useState( null );

	const handleReply = ( commentId ) => {
		setReplyingTo( commentId );
	};

	const handleReplySubmit = async ( content, parentId ) => {
		if ( onReply ) {
			await onReply( content, parentId );
		}
		setReplyingTo( null );
	};

	if ( ! comments || comments.length === 0 ) {
		return (
			<p className="no-comments">
				{ __( 'No comments yet. Be the first to comment!', 'post-review-comments' ) }
			</p>
		);
	}

	return (
		<div className="comment-thread">
			{ comments.map( ( comment ) => (
				<div key={ comment.id } className="comment-with-replies">
					<CommentItem
						comment={ comment }
						onReply={ handleReply }
						onDelete={ onDelete }
						onResolve={ onResolve }
					/>

					{ comment.replies && comment.replies.length > 0 && (
						<div className="comment-replies">
							{ comment.replies.map( ( reply ) => (
								<CommentItem
									key={ reply.id }
									comment={ reply }
									isReply={ true }
								/>
							) ) }
						</div>
					) }

					{ replyingTo === comment.id && (
						<div className="reply-form">
							<CommentForm
								blockId={ blockId }
								parentId={ comment.id }
								mode="reply"
								onCancel={ () => setReplyingTo( null ) }
								onSubmit={ handleReplySubmit }
							/>
						</div>
					) }
				</div>
			) ) }
		</div>
	);
}
