import {getForumById} from '~schema/forum/forum.helpers';
import {getUserById} from '~schema/user/user.helpers';
import db from '~utils/db';
import {isString} from '~utils/format-validations';

/**
 * Gets Messages from a specific Forum ordered by timestamp from the latest to the earliest.
 * @param {String} forumId ID of the Forum to get Messages from
 * @returns Forum's Messages
 */
export function getMessagesByForum(forumId) {
	const formattedMessages = [];
	const messages = db.get('messages')
		.filter({forum: forumId})
		.orderBy('timestamp', 'desc')
		.value();

	for (const message of messages) {
		formattedMessages.push({
			id: message.id,
			forumId: message.forum,
			authorId: message.author,
			payload: message.payload,
			timestamp: message.timestamp
		});
	}

	return formattedMessages;
}

/**
 * Posts a new Message into a Forum.
 * @param {String} userId ID of the User posting the Message
 * @param {String} forumId ID of the Forum in which the Message has to be posted
 * @param {String} payload Payload/text of the Message
 * @returns Newly posted Message
 */
export function postMessage(userId, forumId, payload) {
	const author = getUserById(userId);
	const forum = getForumById(forumId);

	if (!forum.userIds.includes(author.id)) {
		throw new Error('Must be a member of the forum to post a message.');
	}

	if (!isString(payload)) {
		throw new Error('Message payload must be a String.');
	}

	const sanitizedInputMessagePayload = payload.trim();
	if (sanitizedInputMessagePayload.length === 0) {
		throw new Error('Message payload cannot be an empty.');
	}

	const newMessage = db.get('messages')
		.insert({
			forum: forum.id,
			author: author.id,
			payload: sanitizedInputMessagePayload,
			timestamp: (new Date()).toISOString()
		})
		.write();

	return {
		id: newMessage.id,
		forumId: newMessage.forum,
		authorId: newMessage.author,
		payload: newMessage.payload,
		timestamp: newMessage.timestamp
	};
}
