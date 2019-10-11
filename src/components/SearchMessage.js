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

import React, {Component} from 'react'
import Billboard from '@instructure/ui-billboard/lib/components/Billboard'
import Pagination, {PaginationButton} from '@instructure/ui-pagination/lib/components/Pagination'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import {array, func, string, shape, oneOf} from 'prop-types'
import View from '@instructure/ui-layout/lib/components/View'
import EmptyDesert from '../EmptyDesert'
import { connect } from "react-redux";
import UserActions from '../actions/UserActions'

const linkPropType = shape({
  url: string.isRequired,
  page: string.isRequired
}).isRequired

class SearchMessage extends Component {
  static propTypes = {
    noneFoundMessage: string.isRequired,
    getLiveAlertRegion: func,
    dataType: oneOf(['Course', 'User']).isRequired
  }

  static defaultProps = {
    getLiveAlertRegion() {
      return document.getElementById('flash_screenreader_holder')
    }
  }

  state = {}

  componentWillReceiveProps(nextProps) {
    if (!this.props.userList.isLoading) {
      const newState = {}
      if (this.state.pageBecomingCurrent) newState.pageBecomingCurrent = null
      this.setState(newState)
    }
  }

  isLastPageUnknown() {
    return !this.props.userList.links.last
  }

  currentPage() {
    return this.state.pageBecomingCurrent || Number(this.props.userList.links.current.page)
  }

  lastKnownPageNumber() {
    const link =
    this.props.userList.links &&
      (this.props.userList.links.last || this.props.userList.links.next)

    if (!link) return 0
    return Number(link.page)
  }

  renderPaginationButton(pageIndex) {
    const pageNumber = pageIndex + 1
    const isCurrent = this.state.pageBecomingCurrent
      ? pageNumber === this.state.pageBecomingCurrent
      : pageNumber === this.currentPage()
    return (
      <PaginationButton
        key={pageNumber}
        onClick={() => {
          this.props.updateSearchFilter({page:pageNumber});
          this.props.applySearchFilter()
        }}
        current={isCurrent}
        aria-label={`Page ${pageNumber}`}
      >
        {isCurrent && this.state.pageBecomingCurrent ? (
          <Spinner size="x-small" title={'Loading...'} />
        ) : (
          pageNumber
        )}
      </PaginationButton>
    )
  }

  render() {
    const {links, users, isLoading} = this.props.userList;
    const {noneFoundMessage} = this.props
    const errorLoadingMessage = 'There was an error with your query; please try a different search'

    if (this.props.errors) {
      return (
        <div className="text-center pad-box">
          <div className="alert alert-error">{errorLoadingMessage}</div>
        </div>
      )
    } else if (isLoading) {
      return (
        <View display="block" textAlign="center" padding="medium">
          <Spinner size="medium" title={'Loading...'} />
        </View>
      )
    } else if (!users.length) {
      return (
        <Billboard size="large" heading={noneFoundMessage} headingAs="h2" hero={<EmptyDesert />} />
      )
    } else if (links) {
      const lastPageNumber = this.lastKnownPageNumber()
      const lastIndex = lastPageNumber - 1
      const paginationButtons = Array.from(Array(lastPageNumber))
      paginationButtons[0] = this.renderPaginationButton(0)
      paginationButtons[lastIndex] = this.renderPaginationButton(lastIndex)
      const visiblePageRangeStart = Math.max(this.currentPage() - 10, 0)
      const visiblePageRangeEnd = Math.min(this.currentPage() + 10, lastIndex)
      for (let i = visiblePageRangeStart; i < visiblePageRangeEnd; i++) {
        paginationButtons[i] = this.renderPaginationButton(i)
      }

      return (
        <Pagination
          as="nav"
          variant="compact"
          labelNext={'Next Page'}
          labelPrev={'Previous Page'}
        >
          {paginationButtons.concat(
            this.isLastPageUnknown() ? (
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
}

const mapStateToProps = state => {
  return ({
    userList: state.userList
  })
};

const mapDispatchToProps = (dispatch, props) => {
  return({
    updateSearchFilter: (filter) => {dispatch(UserActions.updateSearchFilter(filter))},
    applySearchFilter: () => {dispatch(UserActions.applySearchFilter())}
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchMessage)
