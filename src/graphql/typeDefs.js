import gql from 'graphql-tag';

const typeDefs = gql`

  type SearchFilter {
    sort: String,
    order: String,
    search_term: String,
    role_filter_id: String,
    page: Number
  }

  type Errors {
    search_term: String
  }

  type User {
    name: String
  }

  type Query {
    getErrors: Errors
    searchFilter: String
  }

  type Mutation {
    updateSearchFilter(filter: SearchFilter!): Boolean
  }
`;

export default typeDefs;