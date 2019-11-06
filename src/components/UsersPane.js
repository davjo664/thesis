/*
 * Copyright (C) 2015 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from 'react'
import {shape, func, string} from 'prop-types'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import UsersList from './UsersList'
import UsersToolbar from './UsersToolbar'
import SearchMessage from './SearchMessage'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_SEARCH_FILTER } from '../graphql/mutations'
import Spinner from '@instructure/ui-elements/lib/components/Spinner';
import View from '@instructure/ui-layout/lib/components/View';
import { GET_SEARCH_FILTER, GET_ERRORS, USERS_QUERY } from '../graphql/queries'

const MIN_SEARCH_LENGTH = 3
let previousSearchFilter = {search_term: ''};

const UsersPane = props => {
  const [srMessageDisplayed, setSrMessageDisplayed] = useState(false);
  const [mutate] = useMutation(UPDATE_SEARCH_FILTER);

  useEffect(() => {
    // make page reflect what the querystring params asked for
    let params = new URLSearchParams(window.location.search);
    let searchFilterFromQuery = {};
    for (let p of params) {
      var obj = {};
      obj[p[0]] = p[1];
      searchFilterFromQuery = {...searchFilterFromQuery, ...obj}
    }
    mutate({variables:{ filter: {...searchFilterFromQuery}}})
  }, [])

  const { data: searchFilterData } = useQuery(GET_SEARCH_FILTER);
  const { data: errorsData } = useQuery(GET_ERRORS);
  if (!errorsData.errors) {
    previousSearchFilter = { 
      page: searchFilterData.searchFilter.page ? parseFloat(searchFilterData.searchFilter.page) : 1, 
      search_term: searchFilterData.searchFilter.search_term.length >= MIN_SEARCH_LENGTH ? searchFilterData.searchFilter.search_term : "",
      order: searchFilterData.searchFilter.order,
      sort: searchFilterData.searchFilter.sort,
      role_filter_id: searchFilterData.searchFilter.role_filter_id
    }
  }
  const { loading, error, data, refetch } = useQuery(USERS_QUERY, 
    { variables: previousSearchFilter}
  );

  if (error) {
    return <p>error :(</p>;
  }

  return (
    <div>
      <ScreenReaderContent>
        <h1>{'People'}</h1>
      </ScreenReaderContent>
      {
        <UsersToolbar
          toggleSRMessage={(show = false) => {
            setSrMessageDisplayed(show);
          }}
        />
      }
      {loading ?
        <View display="block" textAlign="center" padding="medium">
          <Spinner size="medium" title={'Loading...'} />
        </View> : 
        <React.Fragment><UsersList
          users={data.users.users}
          noneFoundMessage={'No users found'}
        />
        <SearchMessage
          dataType="User"
        /></React.Fragment>
      }
    </div>
  )
}

export default UsersPane;