import React, { useState, useEffect } from 'react';

const FavouritesLists = ({ onFavouritesChange }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
/**
 * FUNCTION : fetchFavourites
 * DESCRIPTION : This effect retrieves the list of favourite post IDs from localStorage, 
 * fetches their details from Reddit, and updates the favourites state with the fetched posts.
 */
const fetchFavourites = async () => {
      const favouriteIds = JSON.parse(localStorage.getItem('favourites')) || [];
      const posts = await Promise.all(favouriteIds.map(async (id) => {
        const response = await fetch(`https://www.reddit.com/by_id/t3_${id}.json`);
        const json = await response.json();
        return {
          id: json.data.children[0].data.id,
          title: json.data.children[0].data.title,
          score: json.data.children[0].data.score,
          permalink: `https://www.reddit.com${json.data.children[0].data.permalink}`,
        };
      }));
      setFavourites(posts);
    };

    fetchFavourites();
  }, [onFavouritesChange]); // Depend on the onFavouritesChange prop

  /**
 * FUNCTION : removeFavourite
 * DESCRIPTION : This function removes a post from the user's favourites list both in the localStorage and the component state.
 * PARAMETERS : String id : The unique identifier of the post to be removed from favourites.
 */
  const removeFavourite = (id) => {
    // This handles removing a post from the favourites
    const updatedFavourites = favourites.filter(favourite => favourite.id !== id);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites.map(fav => fav.id)));
    setFavourites(updatedFavourites); // Update state
    onFavouritesChange(); // Notify parent component to update
  };

  return (
    <div>
      <h2>Favourite Posts</h2>
      <ul>
        {favourites.map(post => (
          <li key={post.id}>
            <a href={post.permalink} target="_blank" rel="noopener noreferrer">
              {post.title} (Score: {post.score})
            </a>
            <button onClick={() => removeFavourite(post.id)}>Remove from Favourites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavouritesLists;
