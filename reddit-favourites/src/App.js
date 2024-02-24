import React, { useState } from 'react';
import SubredditPosts from './SubredditPosts';
import FavouritesLists from './FavouritesLists'; 

function App() {
  const [subreddit, setSubreddit] = useState('reactjs'); // Default subreddit to start with
  const [favouritesChanged, setFavouritesChanged] = useState(false); // State to trigger re-render when favourites change

/**
 * FUNCTION : handleSubredditChange
 * DESCRIPTION :
 * This function updates the subreddit state based on the user's input in the subreddit input field.
 * PARAMETERS : Event event : The event triggered on input field change, providing the new value.
 */
const handleSubredditChange = (event) => {
    setSubreddit(event.target.value);
  };

/**
 * FUNCTION : handleFavouritesChange
 * DESCRIPTION :
 * This function toggles the favouritesChanged state to trigger a re-render of components that rely on the favourites list.
 */
const handleFavouritesChange = () => {
    setFavouritesChanged(prev => !prev); // Toggle the state to force re-render
  };

  return (
    <div className="App">
      <header>
        <h1>Reddit Top Posts Viewer</h1>
        <input
          type="text"
          value={subreddit}
          onChange={handleSubredditChange}
          placeholder="Enter subreddit name"
        />
      </header>
      <main>
        {/* Passing the subreddit state and the favourites change handler to the SubredditPosts component */}
        <SubredditPosts subreddit={subreddit} onFavouritesChange={handleFavouritesChange} />
        {/* Passing the favourites change handler to the FavouritesLists component, triggering a re-render when favourites change */}
        <FavouritesLists onFavouritesChange={handleFavouritesChange} />
      </main>
    </div>
  );
}

export default App;
