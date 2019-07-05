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
import {string, bool, shape} from 'prop-types'
import {stringify} from 'qs'
import UsersStore from './store/UsersStore'
import UsersPane from './components/UsersPane'

const stores = [ UsersStore ]

export default class AccountCourseUserSearch extends React.Component {
  static propTypes = {
    accountId: string.isRequired,
    rootAccountId: string.isRequired,
    permissions: shape({
      analytics: bool.isRequired
    }).isRequired
  }

  componentWillMount() {
    const {accountId, rootAccountId} = this.props
    stores.forEach(s => {
      s.reset({accountId, rootAccountId})
    })
  }

  updateQueryParams(params) {
    const query = stringify(params)
    window.history.replaceState(null, null, `?${query}`)
  }

  render() {
     return (
      <UsersPane
        {...{
          ...this.props,
          onUpdateQueryParams: this.updateQueryParams,
          queryParams: null
        }}
      />
    )
  }
}
