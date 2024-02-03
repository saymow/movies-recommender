const { readFile, writeFile } = require('fs');


// We have applied feature engineering to the dataset. Some ratings are multiplied
// to boost the representation in the dataset. Below there is a dirty, but effective 
// way of extracting the most rated movies removing repetition. 
readFile('../data/content_item_train.csv', 'utf8', (err, movies_data) => {
  if (err) {
    console.error('Could not read content_item_train.csv file: ', err)
    process.exit(1)
  }
  const movies_rows = movies_data.split('\n').map((row) => row.split(','))

  readFile('../data/content_user_train.csv', 'utf8', (err, users_data) => {
    if (err) {
      console.error('Could not read content_user_train.csv file: ', err)
      process.exit(1)
    }

    const movies_map = new Map()
    const users_rows = users_data.split('\n').map((row) => row.split(','))

    for (let idx = 0; idx < users_rows.length; idx++) {
      const [user_id] = users_rows[idx];
      const [movie_id] = movies_rows[idx];

      if (!movies_map.has(movie_id)) {
        movies_map.set(movie_id, new Set().add(user_id))
      } else {
        const movie_set = movies_map.get(movie_id);
        movie_set.add(user_id)
        movies_map.set(movie_id, movie_set)
      }
    }

    const top_50_movies_list = Array.from(movies_map.entries())
      .map(([id, users_id_set]) => [id, users_id_set.size])
      .sort((movie_a, movie_b) => movie_b[1] - movie_a[1])
      .slice(0, 50)
    const top_50_movies_csv = top_50_movies_list.map(([id, ratings]) => `${id}, ${ratings}`).join('\n')

    writeFile('../data/content_top_50_movies.csv', top_50_movies_csv, 'utf-8', () => {
      if (err) {
        console.error('Could not write content_top_50_movies.csv file: ', err)
        process.exit(1)
      }

      console.log("content_top_50_movies.csv file created succesfuly")
    })
  })
})