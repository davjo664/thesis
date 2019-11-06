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

import React, { useContext } from 'react'
import {string, func, shape} from 'prop-types'
import IconGroupLine from '@instructure/ui-icons/lib/Line/IconGroup'
import IconMoreLine from '@instructure/ui-icons/lib/Line/IconMore'
import IconPlusLine from '@instructure/ui-icons/lib/Line/IconPlus'
import IconStudentViewLine from '@instructure/ui-icons/lib/Line/IconStudentView'

import Button from '@instructure/ui-buttons/lib/components/Button'
import FormFieldGroup from '@instructure/ui-form-field/lib/components/FormFieldGroup'
import {GridCol} from '@instructure/ui-layout/lib/components/Grid'
import Menu, {MenuItem} from '@instructure/ui-menu/lib/components/Menu'

import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Select from '@instructure/ui-core/lib/components/Select'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'

import CreateOrUpdateUserModal from '../CreateOrUpdateUserModal'
import UsersSearchContext from '../context/userssearch-context'
import { GET_ERRORS, GET_SEARCH_FILTER } from '../graphql/queries'
import { UPDATE_SEARCH_FILTER } from '../graphql/mutations'
import { useMutation, useQuery } from '@apollo/react-hooks';

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

const UsersToolbar = (props) => {
  const usersSearchContext = useContext(UsersSearchContext);
  
  const placeholder = 'Search people...'
  const [mutate] = useMutation(UPDATE_SEARCH_FILTER, {variables:{ filter: {} }});
  const { data } = useQuery(GET_SEARCH_FILTER);
  const { data: errorsData } = useQuery(GET_ERRORS);

  return (
    <form onSubmit={preventDefault(mutate)}>
      <FormFieldGroup layout="columns" description="">
        <GridCol width="auto">
          <Select
            label={<ScreenReaderContent>{'Filter by user type'}</ScreenReaderContent>}
            value={data ? data.searchFilter.role_filter_id : ''}
            onChange={e => mutate({variables:{ filter: {role_filter_id: e.target.value, page:1} }})}
          >
            <option key="all" value="">
              {'All Roles'}
            </option>
            {usersSearchContext.roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </Select>
        </GridCol>

        <TextInput
          type="search"
          value={data ? data.searchFilter.search_term:''}
          label={<ScreenReaderContent>{placeholder}</ScreenReaderContent>}
          placeholder={placeholder}
          onChange={e => mutate({variables:{ filter: {search_term: e.target.value, page:1}}})}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              props.toggleSRMessage(true)
            } else {
              props.toggleSRMessage(false)
            }
          }}
          onBlur={() => props.toggleSRMessage(true)}
          onFocus={() => props.toggleSRMessage(false)}
          messages={errorsData.errors && errorsData.errors.search_term && [{type: 'error', text: errorsData.errors.search_term}]}
        />

        <GridCol width="auto">
          {usersSearchContext.permissions.can_create_users && (
            <CreateOrUpdateUserModal
              createOrUpdate="create"
            >
              <Button aria-label={'Add people'}>
                <IconPlusLine />
                {'People'}
              </Button>
            </CreateOrUpdateUserModal>
          )}{' '}
          {renderKabobMenu(usersSearchContext.accountId, usersSearchContext.permissions)}
        </GridCol>
      </FormFieldGroup>
    </form>
  )
}
export default UsersToolbar;

const renderKabobMenu = (accountId, permissions) => {
  const showAvatarItem = permissions.can_manage_admin_users // see accounts_controller#avatars
  const showGroupsItem = permissions.can_manage_groups // see groups_controller#context_index
  if (showAvatarItem || showGroupsItem) {
    return (
      <Menu
        trigger={
          <Button theme={{iconPlusTextMargin: '0'}}>
            <IconMoreLine margin="0" title={'More People Options'} />
          </Button>
        }
      >
        {showAvatarItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/avatars`)}>
            <IconStudentViewLine /> {'Manage profile pictures'}
          </MenuItem>
        )}
        {showGroupsItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/groups`)}>
            <IconGroupLine /> {'View user groups'}
          </MenuItem>
        )}
      </Menu>
    )
  }
  return null
}

UsersToolbar.propTypes = {
  toggleSRMessage: func.isRequired
}