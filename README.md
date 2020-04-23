# Fresh Test

## Notes
- No login is required nor Authorization JWT on requests. A fake LOGGED_USER_ID is injected in server's context for all requests.
- No Error formatting was made. When an error occurs, GraphQL response display the Error RAW data.
- Database and fixtures.json are initialized on on server's first use and default database initialization parameters are available in src/utils/db.js.
- The lowdb library was used to easily create & manipulate a persistant database for this test.
- Yarn was used as package manager.

## GraphQL Schema:
```graphql
type Query {
	"""
	Gets User's joined Forum list
	"""
	getMyJoinedForumList: [Forum!]!
	"""
	Gets the list of forums the User hasn't joined yet
	Forums' Users & Messages won't be accessible since the User hasn't joined these Forums yet
	"""
	getAvailableForumList: [Forum!]!
	"""
	Gets User's profile
	"""
	me: User!
}

type Mutation {
	"""
	Creates a new Forum and automatically add the User in it
	"""
	createForum(
		"""
		New Forum name
		"""
		name: String!
	): Forum!
	"""
	Enables the User to join a Forum
	"""
	joinForum(
		"""
		Id of the Forum to join
		"""
		forumId: String!
	): Forum!
	"""
	Posts a new message in a Forum
	"""
	postMessage(
		"""
		Forum ID
		"""
		forumId: String!
		"""
		Message payload
		"""
		payload: String!
	): Message!
}

type Forum {
	"""
	Forum's ID
	"""
	id: String!
	"""
	Forum's name
	"""
	name: String!
	"""
	List of Forum's Messages
	"""
	messages: [Message!]
	"""
	List of Forum's Users
	"""
	users: [User!]
}

type Message {
	"""
	Message's ID
	"""
	id: String!
	"""
	Message's Forum
	"""
	forum: Forum!
	"""
	Message's author
	"""
	author: User!
	"""
	Message's payload
	"""
	payload: String!
	"""
	Message's timestamp
	"""
	timestamp: DateTime!
}

type User {
	"""
	User's ID
	"""
	id: String!
	"""
	User's first name
	"""
	firstName: String!
	"""
	User's last name
	"""
	lastName: String!
	"""
	User's profile picture URL
	"""
	pictureUrl: String!
}

"""
A date string, such as 2007-12-03
"""
scalar Date
"""
A date-time string at UTC, such as 2007-12-03T10:15:30Z
"""
scalar DateTime
"""
A time string at UTC, such as 10:15:30
"""
scalar Time
```
