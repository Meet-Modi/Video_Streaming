const express = require('express')
const Genre = require('../models/genre')
const Video = require('../models/video');
const Cast = require('../models/cast');
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:term', async (req, res) => {
    const term = req.params.term;
    try {
        var search_result = [];
        // GENRE SEARCH QUERY
        var result = await Genre.find({ name: term });
        var genre_id = 0;
        if (result.length > 0) {
            genre_id = result[0]._id;
        }
        var result_1 = await Video.find({ genreIds: genre_id });
        if (result_1.length > 0) {
            result_1.forEach(element => {
                search_result.push(element._id);
            });
        }
        // VIDEO SEARCH QUERY
        var result_2 = await Video.find({ name: { $regex: term } });
        result_2.forEach(element => {
            search_result.push(element._id);
        });
        // CAST SEARCH QUERY
        var result_3 = await Cast.find({ $or: [{ firstname: { $regex: term } }, { lastname: { $regex: term } }] });
        var result_4 = [];
        console.log(result_3);
        if (result_3.length > 0) {
            for (const resu of result_3) {
                console.log(resu._id);
                result_4 = await Video.find({ castIds: resu._id });
                if (result_4.length > 0) {
                    result_4.forEach(element => {
                        search_result.push(element._id);
                    });
                }
            }
        }
        res.status(201).send({ search_result });

    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
})

module.exports = router