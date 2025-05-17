const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  scoreLead
} = require('../controller/lead.controller');
const { validateLead, validateUUID } = require('../validators/leadValidator');

// CRUD
router.post('/', validateLead, createLead);
router.get('/', getLeads);
router.get('/:id', validateUUID, getLeadById);
router.put('/:id', validateUUID, validateLead, updateLead);
router.delete('/:id', validateUUID, deleteLead);

// AI Lead Scoring
router.post('/:id/score', validateUUID, scoreLead);

module.exports = router;
