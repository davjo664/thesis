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

import React from 'react'
import {shape, func, string} from 'prop-types'
import _ from 'underscore'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import UsersList from './UsersList'
import UsersToolbar from './UsersToolbar'
import SearchMessage from './SearchMessage'
import UserActions from '../actions/UserActions'
import { connect } from "react-redux";

class UsersPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      srMessageDisplayed: false
    }
  }

  componentDidMount = () => {
    // make page reflect what the querystring params asked for
    let params = new URLSearchParams(window.location.search);
    let searchFilterFromQuery = {};
    for (let p of params) {
      var obj = {};
      obj[p[0]] = p[1];
      searchFilterFromQuery = {...searchFilterFromQuery, ...obj}
    }
    const {search_term, role_filter_id} = {...this.props.searchFilter, ...searchFilterFromQuery}
    this.props.updateSearchFilter({search_term, role_filter_id});
    this.props.applySearchFilter();
  }

  render() {
    return (
      <div>
        <ScreenReaderContent>
          <h1>{'People'}</h1>
        </ScreenReaderContent>

        {
          <UsersToolbar
            toggleSRMessage={(show = false) => {
              this.setState({srMessageDisplayed: show})
            }}
          />
        }

        {!_.isEmpty(this.props.users) &&
          !this.props.isLoading && (
            <UsersList />
          )}
        <SearchMessage
          noneFoundMessage={'No users found'}
          dataType="User"
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    users: state.userList.users,
    isLoading: state.userList.isLoading,
    searchFilter: state.userList.searchFilter
  })
};

const mapDispatchToProps = (dispatch, props) => {
  return({
    updateSearchFilter: (filter) => {dispatch(UserActions.updateSearchFilter(filter))},
    applySearchFilter: () => {dispatch(UserActions.applySearchFilter())}
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPane)
