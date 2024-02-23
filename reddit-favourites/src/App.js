import React, { useState } from 'react';
import SubredditPosts from './SubredditPosts';
import FavouritesLists from './FavouritesLists';

function App() {
  const [subreddit, setSubreddit] = useState('reactjs'); // Default subreddit to start with

  // Updating the subreddit state based on user input
  const handleSubredditChange = (event) => {
    setSubreddit(event.target.value);
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
        {/* Passing the subreddit state to the SubredditPosts component */}
        <SubredditPosts subreddit={subreddit} />
        {/* The FavouritesLists component will manage and display the user's favorite posts */}
        <FavouritesLists />
      </main>
    </div>
  );
}

export default App;
