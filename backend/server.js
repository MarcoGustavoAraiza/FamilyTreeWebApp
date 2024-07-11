const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const port = process.env.PORT || 5000;



app.use(cors());

// Endpoint to get all family names
app.get('/all-family-names', (req, res) => {
    const allFamilyNames = require('./data/all_family_names.json');
    res.json(allFamilyNames);
});

// Endpoint to get people data
app.get('/people', (req, res) => {
    const people = require('./data/people.json');
    res.json(people);
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});