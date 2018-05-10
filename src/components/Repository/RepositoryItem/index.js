/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';

import Link from '../../Link';
import Button from '../../Button';

import { STAR_REPOSITORY, UN_STAR_REPOSITORY } from './mutations';

import '../style.css';

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
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
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
