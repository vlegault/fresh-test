import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import lodashId from 'lodash-id';
import faker from 'faker';

export const LOGGED_USER_ID = 'logged_user_id';

const MOCK_FORUM_COUNT = 5;
const MOCK_USER_COUNT = 20;
const MOCK_USER_PER_FORUM_COUNT = Math.ceil(MOCK_USER_COUNT / 4);
const MOCK_MESSAGE_PER_USER_PER_FORUM = 2;

// Incapsulate the database into a singleton in order to use it throughout the solution
export default (() => {
	const adapter = new FileSync('fixtures.json');
	const db = lowdb(adapter);

	// Plugin to automatically generate unique ID on inserts
	db._.mixin(lodashId);

	// Init database
	db.defaults({
		forums: [],
		messages: [],
		users: []
	}).write();

	// Initialize mock users
	let userIds = getDataIds(db.get('users').value());
	if (userIds.length === 0) {
		for (let i = 0; i < MOCK_USER_COUNT; i++) {
			db.get('users')
				.insert({
					firstName: faker.name.firstName(),
					lastName: faker.name.lastName(),
					pictureUrl: faker.image.imageUrl()
				})
				.write();
		}

		userIds = getDataIds(db.get('users').value());

		// Create logged user
		db.get('users')
			.insert({
				id: LOGGED_USER_ID,
				firstName: 'Logged',
				lastName: 'User',
				pictureUrl: faker.image.imageUrl()
			})
			.write();
	}

	// Initialize mock forums
	let forumIds = getDataIds(db.get('forums').value());
	if (forumIds.length === 0) {
		for (let i = 0; i < MOCK_FORUM_COUNT; i++) {
			db.get('forums')
				.insert({
					name: faker.random.word(),
					users: userIds.sort(() => 0.5 - Math.random()).slice(0, MOCK_USER_PER_FORUM_COUNT) // Pick random users to join forum (except logged User)
				})
				.write();
		}

		forumIds = getDataIds(db.get('forums').value());
	}

	// Initialize mock messages
	const messageIds = getDataIds(db.get('messages').value());
	if (messageIds.length === 0) {
		for (const forumId of forumIds) {
			const forumUserIds = db.get('forums').getById(forumId).value().users;
			for (const forumUserId of forumUserIds) {
				for (let i = 0; i < MOCK_MESSAGE_PER_USER_PER_FORUM; i++) {
					db.get('messages')
						.insert({
							forum: forumId,
							author: forumUserId,
							payload: faker.lorem.sentence(),
							timestamp: faker.date.recent()
						})
						.write();
				}
			}
		}
	}

	return db;
})();

function getDataIds(data) {
	return data.map(value => value.id);
}
