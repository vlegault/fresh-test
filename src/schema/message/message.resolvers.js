/* eslint-disable no-unused-vars */
import {postMessage} from './message.helpers';
import {getForumById} from '~schema/forum/forum.helpers';
import {getUserById} from '~schema/user/user.helpers';

function postMessageResolver(parent, {forumId, payload}, context) {
	return postMessage(context.userId, forumId, payload);
}

function forumResolver(parent, args, context) {
	return getForumById(parent.forumId);
}

function authorResolver(parent, args, context) {
	return getUserById(parent.authorId);
}

export default {
	Mutation: {
		postMessage: postMessageResolver
	},
	Message: {
		forum: forumResolver,
		author: authorResolver
	}
};
