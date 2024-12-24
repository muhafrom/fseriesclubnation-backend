const express = require('express');
const { createPart, getParts, updatePart, deletePart } = require('../controllers/partController');

const router = express.Router();

router.post('/add', createPart);
router.get('/get', getParts);
router.put('/update/:id', updatePart);
router.delete('/delete/:id', deletePart);

module.exports = router;