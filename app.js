/* eslint-disable strict */
require('dotenv').config()
const movieData = require('./movies-data.js');
const express = require('express');
const morgan = require('morgan');


const app = express();
app.use(morgan('common'));

app.use(function validateBearerToken(req, res, next) {
    //info will go here
    const apiToken = process.env.API_TOKEN
    const bearerToken = req.get('Authorization')
    if(apiToken !== bearerToken || bearerToken.split(' ')[1]) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})


app.listen(8000, () => {
  console.log('Server started on 8000');
});

app.get('/movie', (req, res) => {
    const { genre = '', country = '', avg_vote = ''} = req.query

    let results = movieData
            .filter(movie => {
                let key;
                let value;
                if(avg_vote !== ''){
                    return movie.avg_vote >= parseFloat(avg_vote)
                }

                if(genre !== ''){
                    key= 'genre'
                    value= genre.toLocaleLowerCase();
                } else if ( country !== ''){
                    key= 'country'
                    value= country.toLocaleLowerCase();
                } else {
                    return true;
                }
                return movie[key].toLowerCase().includes(value);
            })


    res.json(results)
})