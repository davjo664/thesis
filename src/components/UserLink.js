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
import Avatar from '@instructure/ui-elements/lib/components/Avatar'
import Button from '@instructure/ui-buttons/lib/components/Button'
import {string, object} from 'prop-types'

export default function UserLink({user, size, accountId}) {
  const href = `/accounts/${accountId}/users/${user.id}`;
  const name = user.sortable_name;
  const avatar_url = user.avatar_url;
  return (
    <Button
      variant="link"
      theme={{mediumPadding: '0', mediumHeight: '1rem'}}
      href
    >
      <Avatar size={size} name={name} src={avatar_url} margin="0 x-small xxx-small 0" />
      {name}
    </Button>
  )
}

UserLink.propTypes = {
  size: Avatar.propTypes.size,
  user: object.isRequired,
  accountId: string.isRequired
}
