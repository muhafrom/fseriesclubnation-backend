const express = require('express');
const { createMedia, getMedia, updateMedia, deleteMedia } = require('../controllers/mediaController');

const router = express.Router();

router.post('/add', createMedia);
router.get('/get', getMedia);
router.put('/update/:id', updateMedia);
router.delete('/delete/:id', deleteMedia);

module.exports = router;