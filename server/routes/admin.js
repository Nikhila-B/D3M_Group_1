const express = require('express');

let router = express.Router();


router.use('*', (req, res) => {
    // send http 200 status code
    res.sendStatus(200);
});


module.exports = router;