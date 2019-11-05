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
import {string, func, shape, bool, object} from 'prop-types'
import Button from '@instructure/ui-buttons/lib/components/Button'
import Tooltip from '@instructure/ui-overlays/lib/components/Tooltip'
import IconMasqueradeLine from '@instructure/ui-icons/lib/Line/IconMasquerade'
import IconMessageLine from '@instructure/ui-icons/lib/Line/IconMessage'
import IconEditLine from '@instructure/ui-icons/lib/Line/IconEdit'
import CreateOrUpdateUserModal from '../CreateOrUpdateUserModal'
import UserLink from './UserLink'
import { connect } from "react-redux";
import UserActions from '../actions/UserActions'

function UsersListRow({user, permissions, accountId}) {
  return (
    <tr>
      <th scope="row">
        <UserLink
          accountId={accountId}
          user={user}
          size="x-small"
        />
      </th>
      <td>{user.email}</td>
      <td>{user.sis_user_id}</td>
      <td>
        {user.last_login ? user.last_login.slice(0, 10) : ""}
      </td>
      <td style={{whiteSpace: 'nowrap'}}>
        {permissions.can_masquerade && (
          <Tooltip tip={`Act as ${user.name}`}>
            <Button variant="icon" size="small" disabled href={`/users/${user.id}/masquerade`}>
              <IconMasqueradeLine title={`Act as ${user.name}`} />
            </Button>
          </Tooltip>
        )}
        {permissions.can_message_users && (
          <Tooltip tip={`Send message to ${user.name}`}>
            <Button
              disabled
              variant="icon"
              size="small"
              href={`/conversations?user_name=${user.name}&user_id=${user.id}`}
            >
              <IconMessageLine title={`Send message to ${user.name}`} />
            </Button>
          </Tooltip>
        )}
        {permissions.can_edit_users && (
          <CreateOrUpdateUserModal
            createOrUpdate="update"
            user={user}
          >
            <span>
              <Tooltip tip={`Edit ${user.name}`}>
                <Button variant="icon" size="small">
                  <IconEditLine title={`Edit ${user.name}`} />
                </Button>
              </Tooltip>
            </span>
          </CreateOrUpdateUserModal>
        )}
      </td>
    </tr>
  )
}

const mapStateToProps = state => ({
  permissions: state.userList.permissions,
  accountId: state.userList.accountId
});

const mapDispatchToProps = (dispatch, props) => {
  return({
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersListRow)

UsersListRow.propTypes = {
  user: object.isRequired
}
