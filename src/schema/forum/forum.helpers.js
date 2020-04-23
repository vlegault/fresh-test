import {getUserById} from '~schema/user/user.helpers';
import db from '~utils/db';
import {isString} from '~utils/format-validations';

/**
 * Gets Forum details by its ID.
 * @param {String} id ID of the Forum to get
 * @returns Forum
 */
export function getForumById(id) {
	if (!isString(id)) {
		throw new Error('Forum ID must be a String.');
	}

	const sanitizedInputForumId = id.trim();
	if (sanitizedInputForumId.length === 0) {
		throw new Error('Forum ID cannot be an empty String.');
	}

	const forum = db.get('forums')
		.getById(sanitizedInputForumId)
		.value();
	if (!forum) {
		throw new Error(`Forum with ID "${sanitizedInputForumId}" does not exist.`);
	}

	return {
		id: forum.id,
		name: forum.name,
		userIds: forum.users
	};
}

/**
 * Gets the list of Forums a User joined.
 * @param {String} userId ID of the User
 * @returns List of Forums
 */
export function getUserJoinedForums(userId) {
	const userJoinedForums = [];
	if (!isString(userId)) {
		throw new Error('User ID must be a String.');
	}

	const sanitizedInputUserId = userId.trim();
	if (sanitizedInputUserId.length === 0) {
		throw new Error('User ID cannot be an empty String.');
	}

	const forums = db.get('forums')
		.value();
	for (const forum of forums) {
		if (forum.users && forum.users.includes(sanitizedInputUserId)) {
			userJoinedForums.push(getForumById(forum.id));
		}
	}

	return userJoinedForums;
}

/**
 * Gets the list of Forums a User hasn't joined yet.
 * @param {String} userId ID of the User
 * @returns List of Forums
 */
export function getUserAvailableForums(userId) {
	const userAvailableForums = [];
	if (!isString(userId)) {
		throw new Error('User ID must be a String.');
	}

	const sanitizedInputUserId = userId.trim();
	if (sanitizedInputUserId.length === 0) {
		throw new Error('User ID cannot be an empty String.');
	}

	const forums = db.get('forums')
		.value();
	for (const forum of forums) {
		if (!(forum.users && forum.users.includes(sanitizedInputUserId))) {
			userAvailableForums.push(getForumById(forum.id, false));
		}
	}

	return userAvailableForums;
}

/**
 * Creates a new Forum and automatically join its creator in it.
 * @param {String} creatorId User ID of the Forum creator
 * @param {String} name Name of the new Forum
 * @returns Newly created Forum
 */
export function createForum(creatorId, name) {
	if (!isString(name)) {
		throw new Error('Forum name must be a String.');
	}

	const sanitizedInputName = name.trim();
	if (sanitizedInputName.length === 0) {
		throw new Error('Forum name cannot be an empty String.');
	}

	if (doesForumNameExist(sanitizedInputName)) {
		throw new Error(`Forum "${sanitizedInputName}" already exists.`);
	}

	const creator = getUserById(creatorId);
	const newForum = db.get('forums')
		.insert({
			name: sanitizedInputName,
			users: [creator.id]
		})
		.write();

	return {
		id: newForum.id,
		name: newForum.name,
		userIds: newForum.users
	};
}

/**
 * Adds a User to a Forum's members list.
 * @param {String} userId ID of the User who wants to join the Forum
 * @param {String} forumId ID of the Forum to join
 * @returns Forum the User has joined
 */
export function joinForum(userId, forumId) {
	const user = getUserById(userId);
	const forum = getForumById(forumId);

	if (forum.userIds.includes(user.id)) {
		throw new Error('User already joined the Forum.');
	}

	forum.userIds.push(user.id);
	const joinedForum = db.get('forums')
		.find({id: forum.id})
		.assign({users: forum.userIds})
		.write();

	return {
		id: joinedForum.id,
		name: joinedForum.name,
		userIds: joinedForum.users
	};
}

/**
 * Tells if a Forum's name was already taken.
 * @param {String} name Forum's name
 * @returns "true" if Forum's name already exists, "false" otherwise
 */
function doesForumNameExist(name) {
	const forums = db.get('forums')
		.value();
	return forums.findIndex(forum => forum.name === name) >= 0;
}
