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

import Table from '@instructure/ui-elements/lib/components/Table'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import React, { memo } from 'react'
import {arrayOf, string, object, func} from 'prop-types'
import UsersListRow from './UsersListRow'
import UsersListHeader from './UsersListHeader'
import { useQuery } from '@apollo/react-hooks';
import Billboard from '@instructure/ui-billboard/lib/components/Billboard'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import View from '@instructure/ui-layout/lib/components/View'
import EmptyDesert from '../EmptyDesert'
import { USERS_QUERY } from '../graphql/queries'
import { MIN_SEARCH_LENGTH } from './UsersPane'

const UsersList = props => {

  const { loading, error, data } = useQuery(USERS_QUERY, 
    { variables: { 
      page: props.searchFilter.page ? props.searchFilter.page : 1, 
      search_term: props.searchFilter.search_term.length >= MIN_SEARCH_LENGTH ? props.searchFilter.search_term : "",
      order: props.searchFilter.order,
      sort: props.searchFilter.sort,
      role_filter_id: props.searchFilter.role_filter_id
    } }
  );

  if (loading) {
    return (
      <View display="block" textAlign="center" padding="medium">
        <Spinner size="medium" title={'Loading...'} />
      </View>
    )
  }
  if (error) {
    console.log(error);
    console.log(error.message)
    console.log(error.graphQLErrors);
    return <p>error :(</p>;
  }
  if (!data.users.users.length) {
    return (
      <Billboard size="large" heading={props.noneFoundMessage} headingAs="h2" hero={<EmptyDesert />} />
    )
  }

  return (
    <Table
      margin="small 0"
      caption={<ScreenReaderContent>{'Users'}</ScreenReaderContent>}
    >
      <thead>
        <tr>
          <UsersListHeader
            id="username"
            label={'Name'}
            tipDesc={'Click to sort by name ascending'}
            tipAsc={'Click to sort by name descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="email"
            label={'Email'}
            tipDesc={'Click to sort by email ascending'}
            tipAsc={'Click to sort by email descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="sis_id"
            label={'SIS ID'}
            tipDesc={'Click to sort by SIS ID ascending'}
            tipAsc={'Click to sort by SIS ID descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="last_login"
            label={'Last Login'}
            tipDesc={'Click to sort by last login ascending'}
            tipAsc={'Click to sort by last login descending'}
            searchFilter={props.searchFilter}
          />
          <th width="1" scope="col">
            <ScreenReaderContent>{'User option links'}</ScreenReaderContent>
          </th>
        </tr>
      </thead>
      <tbody data-automation="users list">
        {/* use apollo client here and filter on user name as well as page nr. Create the query on the server to accept filtering from /users rest api. */}
        {data.users.users.map(user => (
          <UsersListRow
            key={user.id}
            user={user}
          />
        ))}
      </tbody>
    </Table>
  )
}

UsersList.propTypes = {
  users: arrayOf(object).isRequired,
  searchFilter: object.isRequired,
  noneFoundMessage: string.isRequired
}

export default memo(
  UsersList, 
  (props, nextProps) => {
    let count = 0
    for (const prop in props) {
      ++count
      if (props[prop] !== nextProps[prop]) {
        // a change to searchFilter on it's own should not cause the list
        // to re-render
        if (prop !== 'searchFilter') {
          return true
        }
      }
    }
    return count !== Object.keys(nextProps).length
  }
)