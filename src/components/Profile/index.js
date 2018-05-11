import React from 'react';
import { Query } from 'react-apollo';

import RepositoryList from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

import { GET_REPOSITORIES_OF_CURRENT_USER } from './queries';

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER} notifyOnNetworkStatusChange>
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={viewer.repositories}
          fetchMore={fetchMore}
        />
      );
    }}
  </Query>
);

export default Profile;
