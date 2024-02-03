const { readFile, writeFile } = require('fs')
const puppeteer = require('puppeteer')

const MOVIE_DETAILS_API_REGEXP = /https:\/\/movielens.org\/api\/movies\/\d+$/

const username = "<username>"
const password = "<password>"

const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

const get_recommended_movies_ids = async () => {
  return new Promise((resolve, reject) => {
    readFile('../output/top_50_movies_recommendations.json', 'utf-8', (err, blob) => {
      if (err) {
        reject('Could not read top_50_movies_recommendations.json file: ', err)
      }
      const recommendations = JSON.parse(blob)
      const ids = new Set()

      for (const [movieId, recommendation_data] of Object.entries(recommendations)) {
        ids.add(parseInt(movieId))
        ids.add(parseInt(recommendation_data.recommendation))
      }

      resolve(Array.from(ids))
    })
  })
}

const start_scraping = async (movieIdsList) => {
  const movies_map = new Map()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://movielens.org/login')

  await page.type('input[formcontrolname="userName"]', username)
  await page.type('input[formcontrolname="password"]', password)
  await page.click('button[type="submit"]')

  page.on('response', async response => {
    const request = response.request()
    if (request.url().match(MOVIE_DETAILS_API_REGEXP)) {
      const response_body = JSON.parse(await response.text())
      const movie_data = response_body.data.movieDetails.movie

      movies_map.set(movie_data.movieId, {
        title: movie_data.title,
        summary: movie_data.plotSummary,
        avg_rating: movie_data.avgRating,
        genres: movie_data.genres,
        img_url: `image.tmdb.org/t/p/w185${movie_data.posterPath}`,
        trailer_videos_urls: movie_data.youtubeTrailerIds.map((video_id) => `youtube.com/watch?v=${video_id}`),
        imdb_id: movie_data.imdbMovieId,
        directors: movie_data.directors
      })
    }
  })

  for (movieId of movieIdsList) {
    await page.goto(`https://movielens.org/movies/${movieId}`)
    await sleep(3000)
  }

  return Object.fromEntries(movies_map.entries())
}

const write_recommendations_movies_data = (object) => {
  return new Promise((resolve, reject) => {
    writeFile('../output/recommendation_movies_data.json', JSON.stringify(object), 'utf-8', () => {
      if (err) {
        reject('Could not write top_50_movies_recommendations.json file: ', err)
      }
      resolve()
    })
  })
}


(async () => {
  try {
    const movies_ids = await get_recommended_movies_ids()
    const movies_data = await start_scraping(movies_ids)
    await write_recommendations_movies_data(movies_data)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})();

