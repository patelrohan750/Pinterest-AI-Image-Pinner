const express = require('express');
const { createPin,getBoards,createBoard } = require('../controllers/pinController');

const router = express.Router();

router.post('/create-pins', createPin);
router.get('/boards', getBoards);
router.post('/board', createBoard);


module.exports = router;
