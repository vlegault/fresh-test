import db from '~utils/db';
import {isString} from '~utils/format-validations';

/**
 * Gets a User details by his ID.
 * @param {String} id ID of the User
 * @returns User
 */
export function getUserById(id) {
	if (!isString(id)) {
		throw new Error('User ID must be a String.');
	}

	const sanitizedInputId = id.trim();
	if (sanitizedInputId.length === 0) {
		throw new Error('User ID cannot be an empty String.');
	}

	const user = db.get('users')
		.getById(sanitizedInputId)
		.value();
	if (!user) {
		throw new Error(`User with ID "${sanitizedInputId}" does not exist.`);
	}

	return user;
}
