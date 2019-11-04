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
