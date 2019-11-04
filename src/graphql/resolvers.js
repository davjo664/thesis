import { GET_SEARCH_FILTER, GET_ERRORS } from './queries';
import {stringify} from 'qs'

const MIN_SEARCH_LENGTH = 3

const resolvers = {
  Mutation: {
    updateSearchFilter: (_, { filter }, {cache, client}) => {
      const data = { searchFilter: filter };
      if ( filter && filter.search_term && filter.search_term.length < MIN_SEARCH_LENGTH  ) {
        cache.writeQuery({ query: GET_ERRORS, data: {errors:{search_term: "Search message too short"}} });
      } else {
        cache.writeQuery({ query: GET_ERRORS, data: {errors:null} });
      }
      let oldFilter = cache.readQuery({query:GET_SEARCH_FILTER})
      cache.writeQuery({ query: GET_SEARCH_FILTER, data: {...oldFilter, ...data} });
      
      const query = stringify({...oldFilter.searchFilter, ...data.searchFilter})
      window.history.replaceState(null, null, `?${query}`)

      return true;
    },
  }
}

export default resolvers;