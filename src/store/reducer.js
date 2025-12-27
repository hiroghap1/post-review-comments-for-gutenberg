const DEFAULT_STATE = {
	comments: [],
	version: '1.0',
	loading: false,
	error: null,
};

/**
 * Reducer for comment store
 */
export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'SET_COMMENTS':
			return {
				...state,
				comments: action.comments,
				version: action.version || '1.0',
				loading: false,
			};

		case 'ADD_COMMENT':
			return {
				...state,
				comments: [ ...state.comments, action.comment ],
			};

		case 'UPDATE_COMMENT':
			return {
				...state,
				comments: state.comments.map( ( comment ) =>
					comment.id === action.commentId
						? { ...comment, ...action.updates }
						: comment
				),
			};

		case 'DELETE_COMMENT':
			return {
				...state,
				comments: state.comments.filter(
					( comment ) => comment.id !== action.commentId
				),
			};

		case 'ADD_REPLY':
			return {
				...state,
				comments: state.comments.map( ( comment ) =>
					comment.id === action.parentId
						? {
							...comment,
							replies: [ ...( comment.replies || [] ), action.reply ],
						}
						: comment
				),
			};

		case 'SET_LOADING':
			return {
				...state,
				loading: action.loading,
			};

		case 'SET_ERROR':
			return {
				...state,
				error: action.error,
				loading: false,
			};

		default:
			return state;
	}
}
