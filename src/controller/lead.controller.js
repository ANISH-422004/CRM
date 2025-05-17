const prisma = require('../db/db');
const { getLeadScore } = require('../services/leadScoringService');

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const { name, email, company, status } = req.body;

    const lead = await prisma.lead.create({
      data: { name, email, company, status }
    });

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

// Get All Leads
exports.getLeads = async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json(leads);
};

// Get Lead by ID
exports.getLeadById = async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id }
  });

  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const { name, email, company, status } = req.body;

    const updated = await prisma.lead.update({
      where: { id: req.params.id },
      data: { name, email, company, status }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    await prisma.lead.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// Mock AI Lead Scoring
exports.scoreLead = async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id }
  });
  

  if (!lead) return res.status(404).json({ message: "Lead not found" });

  try {
    const score = await getLeadScore(lead); // await here too

    // console.log(score)
    res.json({ lead_id: lead.id, score });
  } catch (error) {
    res.status(500).json({ error: "Failed to score lead" });
  }
};

