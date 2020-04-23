import {
	getUserJoinedForums,
	getUserAvailableForums,
	createForum,
	joinForum
} from './forum.helpers';
import {getMessagesByForum} from '~schema/message/message.helpers';
import {getUserById} from '~schema/user/user.helpers';

function getMyJoinedForumListResolver(parent, args, context) {
	return getUserJoinedForums(context.userId);
}

function getAvailableForumListResolver(parent, args, context) {
	return getUserAvailableForums(context.userId);
}

function createForumResolver(parent, {name}, context) {
	return createForum(context.userId, name);
}

function joinForumResolver(parent, {forumId}, context) {
	return joinForum(context.userId, forumId);
}

function messagesResolver(parent, args, context) {
	let messages;
	// Show messages only if User has join the Forum
	if (parent.userIds.includes(context.userId)) {
		messages = getMessagesByForum(parent.id);
	}

	return messages;
}

function usersResolver(parent, args, context) {
	let users;
	// Show User list only if User has join the Forum
	if (parent.userIds.includes(context.userId)) {
		users = [];
		for (const userId of parent.userIds) {
			users.push(getUserById(userId));
		}
	}

	return users;
}

export default {
	Query: {
		getMyJoinedForumList: getMyJoinedForumListResolver,
		getAvailableForumList: getAvailableForumListResolver
	},
	Mutation: {
		createForum: createForumResolver,
		joinForum: joinForumResolver
	},
	Forum: {
		messages: messagesResolver,
		users: usersResolver
	}
};
