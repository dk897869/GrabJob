const express = require('express');
const router = express.Router();
const { getFreelanceJobs, getFreelanceJobById } = require('../controllers/freelanceController');

router.get('/', getFreelanceJobs);
router.get('/:id', getFreelanceJobById);

module.exports = router;
