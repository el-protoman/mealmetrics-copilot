const express = require('express');
const router = express.Router();
const { generateInfo } = require('./generateInfo');

// CORS preflight request handling
router.options('/generateInfo', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "POST")
    res.sendStatus(200)
})

// Update the route handler function to accept a prompt type parameter
router.post('/generateInfo/:promptType', (req, res) => {
    // Get the prompt type from the request params
    const promptType = req.params.promptType;

    // Call the generateInfo function with the prompt type
    generateInfo(req, res, promptType);
});

module.exports = router;
