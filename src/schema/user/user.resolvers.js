import {getUserById} from './user.helpers';

async function meResolver(parent, args, context) {
	return getUserById(context.userId);
}

export default {
	Query: {
		me: meResolver
	}
};
