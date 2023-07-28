import React, { useState, useEffect } from 'react'
import axios from './axios';
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({title, fetchUrl, isLargeRow}) {
    /* state is how we write variables in react .... short term storage */
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition/variable
    useEffect(() => {
        // if the below square bracket is empty ... it means run once when the row loads and dont run again
        async function fetchData () {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
        // if we use any information/variable outside the useEffect ,we need to mention it in the square brackets below ..so that when the variable value changes the useEffect is triggered and it runs.
    }, [fetchUrl]);
    
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            //
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('');
        }else {
            movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    }

  return (
    <div className='row'
    >
        {/*  title  */}
        <h2>{title}</h2>

        <div className='row__posters'>
            {/* container -> posters */}

            {movies.map(movie => (
                <img 
                key = {movie.id}
                onClick={() => handleClick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
            ))}
        </div>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

    </div>
  )
}

export default Row