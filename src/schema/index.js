import * as path from 'path';
import {fileLoader, mergeTypes} from 'merge-graphql-schemas';

// Fetch and expose all node resolvers
export const resolvers = fileLoader(path.join(__dirname, './**/*.resolvers.js'));

// Fetch and expose all types
const typesArray = fileLoader(path.join(__dirname, './**/*.typedefs.graphql'));
export const typeDefs = mergeTypes(typesArray);
