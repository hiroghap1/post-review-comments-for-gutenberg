import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { comment as commentIcon } from '@wordpress/icons';

// Import store (this will register it)
import './store';

// Import filters
import './filters/block-attributes-filter';
import './filters/block-controls-filter';
import './filters/block-wrapper-filter';

// Import components
import CommentSidebar from './components/CommentSidebar';
import CommentOverview from './components/CommentOverview';

// Import styles
import './editor.scss';

/**
 * Post Review Comments Plugin
 */
const PostReviewCommentsPlugin = () => {
	return (
		<>
			<PluginSidebar
				name="post-review-comments-sidebar"
				title={ __( 'Block Comments', 'post-review-comments' ) }
				icon={ commentIcon }
			>
				<CommentSidebar />
			</PluginSidebar>

			<PluginDocumentSettingPanel
				name="post-review-comments-overview"
				title={ __( 'Comment Overview', 'post-review-comments' ) }
			>
				<CommentOverview />
			</PluginDocumentSettingPanel>
		</>
	);
};

registerPlugin( 'post-review-comments-for-gutenberg', {
	render: PostReviewCommentsPlugin,
	icon: commentIcon,
} );
