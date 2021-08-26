const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
   });

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then( data => {
        res.json(data);
    })
    .catch( err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, resp, postgres) => {
    let { id } = req.body;

    postgres('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            if(entries.length){
                resp.json(entries[0]);
            } else {
                resp.status(400).json('Failed');
            }           
        })
        .catch(err => resp.status(400).json('Failed to Update'));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};