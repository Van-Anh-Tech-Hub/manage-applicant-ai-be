import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { applyMiddleware } from 'graphql-middleware'
import { candidateProfileResolvers } from '../../modules/candidate-profile'
import { userResolvers } from '../../modules/user'
import { authResolvers } from './../../modules/auth'
import { jobResolvers } from '../../modules/job'
import { companyResolvers } from '../../modules/company'
import { authenticate } from './authenticate'
import { jobTypeResolvers } from '../../modules/job-type'
import { locationResolvers } from '../../modules/location'
import { jobCategoryResolvers } from '../../modules/job-category'
import { applicationResolvers } from '../../modules/application'
const typesArray = loadFilesSync('src/modules/**/*.graphql')

const typeDefs = mergeTypeDefs(typesArray)

const resolvers = mergeResolvers([
  userResolvers,
  authResolvers,
  candidateProfileResolvers,
  jobResolvers,
  companyResolvers,
  jobTypeResolvers,
  locationResolvers,
  jobCategoryResolvers,
  applicationResolvers,
])

const middleware = {
  Query: {
    getInfoUser: authenticate,
  },
  Mutation: {},
}

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  middleware
)

export default schema
