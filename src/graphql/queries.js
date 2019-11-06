import gql from 'graphql-tag';
export const USERS_QUERY = gql`
    query UsersQuery($page: Int!, $search_term: String!, $sort: String, $order: String, $role_filter_id: String) {
      users(page: $page, search_term: $search_term, sort: $sort, order: $order, role_filter_id: $role_filter_id) {
        users {
          id,
          name,
          sortable_name,
          short_name,
          email,
          time_zone,
          avatar_url,
          last_login,
          sis_user_id
        },
        links {
          current,
          next,
          last
        }
      }
    }
`;

export const GET_ERRORS = gql`
  query getErrors {
    errors @client
  }
`;

export const GET_SEARCH_FILTER = gql`
  query getSearchFilter {
    searchFilter @client {
      search_term,
      role_filter_id,
      sort,
      order,
      page
    }
  }
`;

export const GET_PERMISSIONS = gql`
  query getPermissions {
    permissions @client {
      can_masquerade,
      can_message_users,
      can_edit_users,
      can_create_users
    }
  }
`;

export const GET_ROOT_ACCOUNT_ID = gql`
  query getRootAccountId {
    rootAccountId @client
  }
`;

export const GET_ACCOUNT_ID = gql`
  query getAccountId {
    accountId @client
  }
`;

export const GET_ROLES = gql`
  query getRoles {
    roles @client {
      id
      label
    }
  }
`;
