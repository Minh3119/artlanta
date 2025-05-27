import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchPosts();
  }

  async fetchPosts() {
    this.setState({ loading: true });
    try {
      const res = await fetch('/api/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Failed to load posts');
        this.setState({ loading: false });
        return;
      }

      const data = await res.json();
      if (data.response && Array.isArray(data.response)) {
        this.setState({ posts: data.response, loading: false });
      } else {
        toast.error('Invalid response format');
        this.setState({ loading: false });
      }
    } catch (error) {
      toast.error('Error fetching posts: ' + error.message);
      this.setState({ loading: false });
    }
  }

  render() {
    const { posts, loading } = this.state;

    return (
      <>
        <h1>All Posts</h1>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div>
            {posts.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                  <h3>{post.title}</h3>
                  <p><b>User ID:</b> {post.userId}</p>
                  <p><b>Content:</b> {post.content}</p>
                  <p><b>Draft:</b> {post.isDraft ? 'Yes' : 'No'}</p>
                  <p><b>Visibility:</b> {post.visibility}</p>
                  <p><b>Created At:</b> {post.createdAt}</p>
                  <p><b>Updated At:</b> {post.updatedAt || 'N/A'}</p>
                  <p><b>Deleted:</b> {post.isDeleted ? 'Yes' : 'No'}</p>
                </div>
              ))
            )}
          </div>
        )}
        <ToastContainer />
      </>
    );
  }
}

export default PostListPage;
