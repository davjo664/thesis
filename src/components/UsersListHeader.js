/*
 * Copyright (C) 2018 - present Instructure, Inc.
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
import {string, func, shape} from 'prop-types'
import Tooltip from '@instructure/ui-overlays/lib/components/Tooltip'
import IconMiniArrowUp from '@instructure/ui-icons/lib/Solid/IconMiniArrowUp'
import IconMiniArrowDown from '@instructure/ui-icons/lib/Solid/IconMiniArrowDown'
import Button from '@instructure/ui-buttons/lib/components/Button'
import UserActions from '../actions/UserActions'
import { connect } from "react-redux";

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

function UsersListHeader(props) {
  const {id, tipAsc, tipDesc, label} = props
  const {sort, order, search_term, role_filter_id} = props.searchFilter
  const newOrder = (sort === id && order === 'asc') || (!sort && id === 'username') ? 'desc' : 'asc'

  return (
    <th scope="col">
      <Tooltip tip={sort === id && order === 'asc' ? tipAsc : tipDesc}>
        <Button
          onClick={preventDefault(() => {
            props.updateSearchFilter({search_term, sort: id, order: newOrder, role_filter_id})
            props.applySearchFilter();
          })}
          variant="link"
          theme={{fontWeight: '700', mediumPadding: '0', mediumHeight: '1.5rem'}}
        >
          {label}
          {sort === id ? order === 'asc' ? <IconMiniArrowUp /> : <IconMiniArrowDown /> : ''}
        </Button>
      </Tooltip>
    </th>
  )
}

const mapStateToProps = state => ({
  searchFilter: state.userList.searchFilter
});

const mapDispatchToProps = (dispatch, props) => {
  return({
    updateSearchFilter: (filter) => {dispatch(UserActions.updateSearchFilter(filter))},
    applySearchFilter: () => {dispatch(UserActions.applySearchFilter())}
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersListHeader)

UsersListHeader.propTypes = {
  id: string.isRequired,
  tipAsc: string.isRequired,
  tipDesc: string.isRequired,
  label: string.isRequired
}
