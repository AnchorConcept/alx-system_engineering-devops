// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const searchMovies = async () => {
    if (!query) return;
    const res = await fetch(`https://www.omdbapi.com/?apikey=9e8b2f9c&s=${query}`);
    const data = await res.json();
    setResults(data.Search || []);
  };

  const fetchMovieDetails = async (id, title) => {
    const omdbURL = `https://www.omdbapi.com/?apikey=9e8b2f9c&i=${id}&plot=full`;
    const ytURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      title + ' official trailer'
    )}&key=AIzaSyAWBG5zJ8X0BVcrJ93plfjwkc_shJAq10M&type=video&maxResults=1`;

    const [omdbRes, ytRes] = await Promise.all([fetch(omdbURL), fetch(ytURL)]);
    const movie = await omdbRes.json();
    const ytData = await ytRes.json();

    if (ytData.items?.length) {
      movie.trailerId = ytData.items[0].id.videoId;
    }

    setSelectedMovie(movie);
    setShowModal(true);
  };

  return (
    <div className="app">
      <h1 className="title">🎥 Anijay Movie Finder</h1>

      <div className="search-section">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      <div className="movie-grid">
        {results.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => fetchMovieDetails(movie.imdbID, movie.Title)}
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>

      {showModal && selectedMovie && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.Title}</h2>
            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>Rating:</strong> {selectedMovie.imdbRating}/10</p>

            {selectedMovie.trailerId && (
              <div className="trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedMovie.trailerId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Movie Trailer"
                ></iframe>
              </div>
            )}

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
