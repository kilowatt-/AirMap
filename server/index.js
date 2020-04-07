const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const START_EPOCH = 1576368000;
const END_EPOCH = START_EPOCH + 604800;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/routeData/:airportCode', async (req, res) => {

    if (req.params.airportCode) {
        const code = req.params.airportCode.toUpperCase();

        const url = process.env.BASE_URL;

        try {
            const data = await axios.get(url, {
                params: {
                    airport: code,
                    begin: START_EPOCH,
                    end: END_EPOCH
                }
            });

            const response = data.data;

            res.send(response);
        } catch (err) {
            res.status(err.response && err.response.status ? err.response.status : 500);
            res.send({error: err.message});
        }

    } else {
        res.status(400);
        res.send({ error: 'Bad request'} );
    }

});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
