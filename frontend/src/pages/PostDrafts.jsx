import React from 'react';
import DraftsList from '../components/DraftsList';
import PublishedPostsList from '../components/PublishedPostsList';
import PostEditor from '../components/PostEditor';

function PostDrafts() {
    return (
        <div>
            <h1>Drafting</h1>
            <PostEditor />
            <hr />
            <DraftsList />
            <hr />
            <PublishedPostsList />
        </div>
    );
}
    export default PostDrafts;