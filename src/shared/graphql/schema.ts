import { applyMiddleware } from 'graphql-middleware';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers, TypeSource } from '@graphql-tools/utils';
import { DocumentNode, GraphQLScalarType } from 'graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import path from 'path';
import authenticate from './authenticate';

type T_ResolverObject = Record<string, Record<string, GraphQLScalarType>>;

const currentDir = path.resolve(__dirname, '../../');

const typesArray: TypeSource = loadFilesSync<string>(path.join(currentDir, '/**/*.graphql'), {
    recursive: true,
});

const resolversArray: IResolvers[] = loadFilesSync<T_ResolverObject>(path.join(currentDir, '/**/*.resolver.{js,ts}'), {
    recursive: true,
});

const allTypes: DocumentNode = mergeTypeDefs(typesArray);
const allResolvers: IResolvers = mergeResolvers(resolversArray);

const schemaWithoutMiddleware = makeExecutableSchema({
    typeDefs: allTypes,
    resolvers: {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
        ...allResolvers,
    },
});

// Apply middleware to queries/mutations that need authentication
const schema = applyMiddleware(
    schemaWithoutMiddleware,
    {
        Query: {
            // yourQueryName: authenticate, // Apply to specific queries
        },
        Mutation: {
            // yourMutationName: authenticate, // Apply to specific mutations
        },
    }
);

export default schema;
