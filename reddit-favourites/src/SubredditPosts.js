import React, { useState, useEffect } from 'react';

const SubredditPosts = ({ subreddit }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setPosts(data.data.children.map(child => child.data));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (subreddit) {
            fetchTopPosts();
        }
    }, [subreddit]);

    const toggleFavorite = (id) => {
        const currentFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (currentFavorites.includes(id)) {
            localStorage.setItem('favorites', JSON.stringify(currentFavorites.filter(favoriteId => favoriteId !== id)));
        } else {
            localStorage.setItem('favorites', JSON.stringify([...currentFavorites, id]));
        }
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
                {posts.map(post => (
                    <li key={post.id}>
                        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                            {post.title} (Score: {post.score})
                        </a>
                        <button onClick={() => toggleFavorite(post.id)}>
                            {JSON.parse(localStorage.getItem('favorites') || '[]').includes(post.id) ? 'Unfavorite' : 'Favorite'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubredditPosts;
