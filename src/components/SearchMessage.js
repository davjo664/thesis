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

import React, {Component, useState, useEffect} from 'react'
import Billboard from '@instructure/ui-billboard/lib/components/Billboard'
import Pagination, {PaginationButton} from '@instructure/ui-pagination/lib/components/Pagination'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import {array, func, string, shape, oneOf} from 'prop-types'
import View from '@instructure/ui-layout/lib/components/View'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { USERS_QUERY } from '../graphql/queries'
import { MIN_SEARCH_LENGTH } from './UsersPane'

const linkPropType = shape({
  url: string.isRequired,
  page: string.isRequired
}).isRequired

const SearchMessage = props => {

  const [state, setState] = useState({});

  useEffect(()=>{
    props.setPage(state.pageBecomingCurrent)
  }, [ state.pageBecomingCurrent ])

  const { loading, error, data } = useQuery(USERS_QUERY, 
    { variables: { 
      page: props.searchFilter.page ? props.searchFilter.page : 1, 
      search_term: props.searchFilter.search_term.length >= MIN_SEARCH_LENGTH ? props.searchFilter.search_term : "",
      order: props.searchFilter.order,
      sort: props.searchFilter.sort,
      role_filter_id: props.searchFilter.role_filter_id
    } 
    }
  );

  if (loading || !data.users || !data.users.users.length) return <p></p>;

  const defaultProps = {
    getLiveAlertRegion() {
      return document.getElementById('flash_screenreader_holder')
    }
  }

  const handleSetPage = page => {
    setState({...state, pageBecomingCurrent: page})
  }

  const isLastPageUnknown = () => {
    return !data.users.links.last
  }

  const currentPage = () => {
    return Number(data.users.links.current)
  }

  const lastKnownPageNumber = () => {
    const link = data.users.links.last ? data.users.links.last : data.users.links.next
    if (!link) return 0
    return Number(link)
  }

  const renderPaginationButton = (pageIndex) => {
    const pageNumber = pageIndex + 1
    const isCurrent = pageNumber === currentPage()
    return (
      <PaginationButton
        key={pageNumber}
        onClick={() => handleSetPage(pageNumber)}
        current={isCurrent}
        aria-label={`Page ${pageNumber}`}
      >
        {pageNumber}
      </PaginationButton>
    )
  }

  const {collection} = props
  const errorLoadingMessage = 'There was an error with your query; please try a different search'

  if (data.users.links) {
    const lastPageNumber = lastKnownPageNumber()
    const lastIndex = lastPageNumber - 1
    const paginationButtons = Array.from(Array(lastPageNumber))
    paginationButtons[0] = renderPaginationButton(0)
    paginationButtons[lastIndex] = renderPaginationButton(lastIndex)
    const visiblePageRangeStart = Math.max(currentPage() - 10, 0)
    const visiblePageRangeEnd = Math.min(currentPage() + 10, lastIndex)
    console.log("visiblePageRangeStart",visiblePageRangeStart);
    console.log("visiblePageRangeEnd",visiblePageRangeEnd)
    for (let i = visiblePageRangeStart; i < visiblePageRangeEnd; i++) {
      paginationButtons[i] = renderPaginationButton(i)
    }

    return (
      <Pagination
        as="nav"
        variant="compact"
        labelNext={'Next Page'}
        labelPrev={'Previous Page'}
      >
        {paginationButtons.concat(
          isLastPageUnknown() ? (
            <span key="page-count-is-unknown-indicator" aria-hidden>
              ...
            </span>
          ) : (
            []
          )
        )}
      </Pagination>
    )
  } else {
    return <div />
  }
}

SearchMessage.propTypes = {
  setPage: func.isRequired,
  getLiveAlertRegion: func,
  dataType: oneOf(['Course', 'User']).isRequired
}

export default SearchMessage;