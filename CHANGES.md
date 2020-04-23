# New Fresh Test API
The app now has a notion of public and private forums.
When a user creates a forum, he can mark it as private. He will automatically be the admin of this forum.
When a forum is private, no-one can see it in the list of available forums.
A user can ask to join a private forum only if he knows the forum ID.
When an ask request is sent, the admin of this forum can accept or refuse the request.
If the request is accepted, the user automatically joins the forum.
If the request is refused, the user is not notified.

```graphql
type Query {
	"""
	Gets User's joined Forum list
	"""
	getMyJoinedForumList: [Forum!]!
	"""
	Gets the list of forums the User hasn't joined yet
	Private Forums won't be listed
	Forums' Users & Messages won't be accessible since the User hasn't joined these Forums yet
	"""
	getAvailableForumList: [Forum!]!
	"""
	Gets User's join private Forum requests he received as a private Forum admin
	"""
	getJoinPrivateForumRequestList: [PrivateRequest!]!
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
		"""
		Is new Forum private?
		Will be set to "false" by default
		"""
		isPrivate: Boolean = false
	): Forum!
	"""
	Enables the User to join a public Forum
	"""
	joinPublicForum(
		"""
		ID of the public Forum to join
		"""
		forumId: String!
	): Forum!
	"""
	Sends a request to join a private Forum
	Will return "true" if request was well received by the server despite if the Forum exists or not (for security purposes, we don't want to tell if a private Forum exists)
	"""
	sendRequestToJoinPrivateForum(
		"""
		ID of the private Forum
		"""
		forumId: String!
	): Boolean!
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
	"""
	Accepts a private request that was made to join a private Forum and adds the requester as a member of the targeted Forum
	Once accpeted, the private request will be destroyed
	An error will be thrown if the private request ID doesn't exists or if the User is not the admin of the Forum targeted by the private request
	"""
	acceptPrivateRequest(
		"""
		Private request ID
		"""
		privateRequestId: String!
	): Forum!
	"""
	Denies a private request that was made to join a private Forum
	Once denied, the private request will be destroyed
	An error will be thrown if the private request ID doesn't exists or if the User is not the admin of the Forum targeted by the private request
	"""
	deniedPrivateRequest(
		"""
		Private request ID
		"""
		privateRequestId: String!
	): Forum!
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
	Is Forum private?
	"""
	isPrivate: Boolean!
	"""
	Forum's admin (available when Forum is private)
	"""
	admin: User
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

type PrivateRequest {
	"""
	Private resquest ID
	"""
	id: String!
	"""
	Private resquest related Forum
	"""
	forum: Forum!
	"""
	Private resquest requester
	"""
	requester: User!
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
