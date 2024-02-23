import React, { useState, useEffect } from 'react';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
      const posts = await Promise.all(favoriteIds.map(async (id) => {
        const response = await fetch(`https://www.reddit.com/by_id/t3_${id}.json`);
        const json = await response.json();
        return {
          id: json.data.children[0].data.id,
          title: json.data.children[0].data.title,
          score: json.data.children[0].data.score,
          permalink: `https://www.reddit.com${json.data.children[0].data.permalink}`,
        };
      }));
      setFavorites(posts);
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = JSON.parse(localStorage.getItem('favorites')).filter(favoriteId => favoriteId !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(favorites.filter(post => post.id !== id));
  };

  return (
    <div>
      <h2>Favorite Posts</h2>
      <ul>
        {favorites.map(post => (
          <li key={post.id}>
            <a href={post.permalink} target="_blank" rel="noopener noreferrer">
              {post.title} (Score: {post.score})
            </a>
            <button onClick={() => removeFavorite(post.id)}>Remove from Favorites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
