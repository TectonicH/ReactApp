import React, { useState, useEffect } from 'react';

const SubredditPosts = ({ subreddit, onFavouritesChange }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
    * FUNCTION : fetchTopPosts
    * DESCRIPTION :
    * This effect fetches the top posts from a specified subreddit using the Reddit API and updates the posts state.
    */
    const fetchTopPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setPosts(data.data.children.map((child) => child.data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, [subreddit]);

  /**
  * FUNCTION : toggleFavourite
  * DESCRIPTION : This function adds or removes a post ID to the list of favourites in localStorage and invokes the onFavouritesChange callback to notify the parent component of the update.
  * PARAMETERS : String id : The unique identifier of the post to be toggled in the favourites list.
  */
  const toggleFavourite = (id) => {
    const currentFavourites = JSON.parse(localStorage.getItem('favourites')) || [];
    let newFavourites;
    if (currentFavourites.includes(id)) {
      newFavourites = currentFavourites.filter((favouriteId) => favouriteId !== id);
    } else {
      newFavourites = [...currentFavourites, id];
    }
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
    onFavouritesChange(); // Call this to inform the App component of the change
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Top Posts in r/{subreddit}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
              {post.title} (Score: {post.score})
            </a>
            <button onClick={() => toggleFavourite(post.id)}>
              {JSON.parse(localStorage.getItem('favourites') || '[]').includes(post.id) ? 'Unfavourite' : 'Favourite'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubredditPosts;
