const BASE_URL = 'http://www.omdbapi.com';
const API_KEY = '5cd8a7e3';

interface MovieRating {
    Source: String;
    Value: String;
}

interface OMDBMovieResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: MovieRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    Error?: string;
}

async function getMovieByIMBDId(imdbID: string):Promise<OMDBMovieResponse> {

    const url = `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`;
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json() as OMDBMovieResponse;
}

function renderMovie(doc: Document, movie: OMDBMovieResponse): void {
    const app = doc.getElementById('app');
    if(!app) {
        return
    }

    app.innerHTML = `
        <div class="movie">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <img src="${movie.Poster}" alt="${movie.Title}" style="max-width: 300px;" />
        <pre>${JSON.stringify(movie, null, 2)}</pre>
        </div>
    `
}

getMovieByIMBDId('tt3896198')
    .then(movie => {
        renderMovie(document, movie)
    })
    .catch(error => {
        const app = document.getElementById('app');
        if(app) {
            app.innerHTML = `<p> style='color: red;'> Error: ${error.message} </p>`;
        }
    })

