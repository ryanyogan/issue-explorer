/* eslint-disable react/no-danger */
import React from 'react';

import './style.css';

const Comment = ({ comment }) => (
  <div className="CommentItem">
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

export default Comment;
