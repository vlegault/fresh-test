import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {typeDefs, resolvers} from '~schema';
import {LOGGED_USER_ID} from '~utils/db';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async () => {
		return {
			// For test purposes, always return fake Logged User ID in the context
			userId: LOGGED_USER_ID
		};
	}
});
const app = express();
server.applyMiddleware({app, path: '/'});
app.listen({port: 4000}, () =>
	console.log(`Fresh Test server running at http://localhost:4000${server.graphqlPath}`)
);
