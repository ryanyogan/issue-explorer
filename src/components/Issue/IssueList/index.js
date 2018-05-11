import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { withState } from 'recompose';

import { GET_ISSUES_OF_REPOSITORY } from './queries';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';
import FetchMore from '../../FetchMore';

// The worlds most naive state machine :)
const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <div className="Issues">
    <ButtonUnobtrusive
      onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
    >
      {TRANSITION_LABELS[issueState]}
    </ButtonUnobtrusive>

    {isShow(issueState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{ repositoryName, repositoryOwner, issueState }}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          const { repository } = data;

          if (loading && !repository) {
            return <Loading />;
          }

          if (!repository.issues.edges.length) {
            return <div className="IssueList">No issues ...</div>;
          }

          return (
            <IssueList
              issues={repository.issues}
              loading={loading}
              fetchMore={fetchMore}
            />
          );
        }}
      </Query>
    )}
  </div>
);

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issues: {
        ...previousResult.repository.issues,
        ...fetchMoreResult.repository.issues,
        edges: [
          ...previousResult.repository.issues.edges,
          ...fetchMoreResult.repository.issues.edges,
        ],
      },
    },
  };
};

const IssueList = ({ issues, loading, fetchMore }) => (
  <Fragment>
    <div className="IssueList">
      {issues.edges.map(({ node: issue }) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>

    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      variables={{
        cursor: issues.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Issues
    </FetchMore>
  </Fragment>
);

export default withState('issueState', 'onChangeIssueState', ISSUE_STATES.NONE)(
  Issues,
);
