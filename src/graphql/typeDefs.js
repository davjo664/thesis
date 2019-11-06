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

  type Permissions {
    can_masquerade: Boolean,
    can_message_users: Boolean,
    can_edit_users: Boolean,
    can_create_users: Boolean
  }

  type Role {
    id: Number,
    label: String
  }

  type Query {
    getErrors: Errors,
    searchFilter: String,
    permissions: Permissions,
    rootAccountId: String,
    accountId: String,
    roles: [Role]
  }

  type Mutation {
    updateSearchFilter(filter: SearchFilter!): Boolean
  }
`;

export default typeDefs;