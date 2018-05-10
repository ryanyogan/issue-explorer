/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';

import REPOSITORY_FRAGMENT from '../fragments';
import Link from '../../Link';
import Button from '../../Button';

import { STAR_REPOSITORY, UN_STAR_REPOSITORY } from './mutations';

import '../style.css';

const updateAddStar = (
  client,
  {
    data: {
      addStar: {
        starrable: { id }
      }
    }
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        {!viewerHasStarred ? ( // we prefix with ! as we want to see the buttons for now
          <Mutation
            mutation={STAR_REPOSITORY}
            variables={{ id }}
            update={updateAddStar}
          >
            {(addStar, { data, loading, error }) => (
              <Button
                className={`RepositoryItem-title-action`}
                onClick={addStar}
              >
                {stargazers.totalCount} Star(s)
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={UN_STAR_REPOSITORY} variables={{ id }}>
            {(removeStar, { data, loading, error }) => (
              <Button
                className={`RepositoryItem-title-action`}
                onClick={removeStar}
              >
                {stargazers.totalCount} Star(s)
              </Button>
            )}
          </Mutation>
        )}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />

      <div className="RepositoryItem-description-details">
        <Fragment>
          {primaryLanguage && <span>Language: {primaryLanguage.name} </span>}

          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </Fragment>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
