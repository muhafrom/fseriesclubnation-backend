const express = require('express');
const { createPart, getParts, updatePart, deletePart } = require('../controllers/partController');
const { upload } = require('../services/s3Service');

const router = express.Router();

router.post('/create', upload.single('image'), createPart);
router.get('/get', getParts);
router.put('/update/:id', upload.single('image'), updatePart);
router.delete('/delete/:id', deletePart);

module.exports = router;