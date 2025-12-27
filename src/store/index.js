import { createReduxStore, register } from '@wordpress/data';
import * as actions from './actions';
import * as selectors from './selectors';
import reducer from './reducer';
import * as resolvers from './resolvers';

const STORE_NAME = 'post-review-comments/store';

const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
	resolvers,
} );

register( store );

export default STORE_NAME;
