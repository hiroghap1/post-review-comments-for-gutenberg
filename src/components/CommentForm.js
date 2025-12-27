import { useState } from '@wordpress/element';
import { Button, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function CommentForm( { blockId, parentId = null, mode = 'new', onCancel, onSubmit } ) {
	const [ content, setContent ] = useState( '' );
	const [ isSubmitting, setIsSubmitting ] = useState( false );

	const handleSubmit = async ( e ) => {
		e.preventDefault();

		if ( ! content.trim() ) {
			return;
		}

		setIsSubmitting( true );

		try {
			if ( onSubmit ) {
				await onSubmit( content, parentId );
			}
			setContent( '' );
		} catch ( error ) {
			console.error( 'Error submitting comment:', error );
		} finally {
			setIsSubmitting( false );
		}
	};

	const placeholder = mode === 'reply'
		? __( 'Write a reply...', 'post-review-comments' )
		: __( 'Add a comment...', 'post-review-comments' );

	return (
		<form onSubmit={ handleSubmit } className="comment-form">
			<TextareaControl
				value={ content }
				onChange={ setContent }
				placeholder={ placeholder }
				rows={ 3 }
			/>
			<div className="comment-form-actions">
				<Button
					type="submit"
					variant="primary"
					disabled={ ! content.trim() || isSubmitting }
					isBusy={ isSubmitting }
				>
					{ mode === 'reply'
						? __( 'Reply', 'post-review-comments' )
						: __( 'Comment', 'post-review-comments' )
					}
				</Button>
				{ onCancel && (
					<Button
						variant="tertiary"
						onClick={ onCancel }
						disabled={ isSubmitting }
					>
						{ __( 'Cancel', 'post-review-comments' ) }
					</Button>
				) }
			</div>
		</form>
	);
}
