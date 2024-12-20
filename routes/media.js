const express = require('express');
const { createMedia, getMedia, updateMedia, deleteMedia } = require('../controllers/mediaController');
const { upload } = require('../services/s3Service');

const router = express.Router();

router.post('/create', upload.single('image'), createMedia);
router.get('/get', getMedia);
router.put('/update/:id', upload.single('image'), updateMedia);
router.delete('/delete/:id', deleteMedia);

module.exports = router;