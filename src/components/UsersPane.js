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

import React, { useReducer, useEffect, useState } from 'react'
import {shape, func, string} from 'prop-types'
import _ from 'underscore'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import UsersList from './UsersList'
import UsersToolbar from './UsersToolbar'
import SearchMessage from './SearchMessage'
import UserActions from '../actions/UserActions'
import UsersPaneContext from '../context/userspane-context'
import rootReducer from '../reducers/rootReducer';
import initialState from '../store/initialState';

const MIN_SEARCH_LENGTH = 3
export const SEARCH_DEBOUNCE_TIME = 750

const UsersPane = props => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [srMessageDisplayed, setSrMessageDisplayed] = useState(false);

  const [searchFilter, setSearchFilter] = useState({search_term: ''});
  const [searchTermTooShort, setSearchTermTooShort] = useState(false);

  useEffect(() => {
    const {search_term, role_filter_id} = {...UsersToolbar.defaultProps, ...props.queryParams}
    setSearchFilter({search_term, role_filter_id});
  }, [])

  useEffect(() => {
    updateQueryString()
  }, [ searchFilter ])

  const updateQueryString = () => {
    props.onUpdateQueryParams(searchFilter)
  }

  const handleUpdateSearchFilter = filter => {
    setSearchFilter({...searchFilter, ...filter, page: null});
    if ( filter && filter.search_term.length < MIN_SEARCH_LENGTH ) {
      setSearchTermTooShort(true);
    } else {
      setSearchTermTooShort(false);
    }
  }

  const handleSubmitEditUserForm = (attributes, id) => {
    // handleApplyingSearchFilter()
  }

  const handleSetPage = page => {
    setSearchFilter({...searchFilter, page });
  }

  return (
    <div>
      <ScreenReaderContent>
        <h1>{'People'}</h1>
      </ScreenReaderContent>
      <UsersPaneContext.Provider value={{
        handleSubmitEditUserForm: handleSubmitEditUserForm,
        onUpdateFilters: handleUpdateSearchFilter
      }}>
      {
        <UsersToolbar
          errors={searchTermTooShort ? {search_term: "Search message too short"} : {}}
          {...searchFilter}
          toggleSRMessage={(show = false) => {
            setSrMessageDisplayed(show);
          }}
        />
      }
      { 
        <UsersList
          searchFilter={searchFilter}
          noneFoundMessage={'No users found'}
        />
      }
      <SearchMessage
        searchFilter={searchFilter}
        setPage={handleSetPage}
        dataType="User"
      />
      </UsersPaneContext.Provider>
    </div>
  )
}

UsersPane.propTypes = {
  onUpdateQueryParams: func.isRequired,
  queryParams: shape({
    page: string,
    search_term: string,
    role_filter_id: string
  }).isRequired
}

export default UsersPane;