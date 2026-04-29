import express from 'express';
import Application from '../models/Application.js';
import { runFullAudit } from '../services/complianceEngine.js';

const router = express.Router();

// 1. Submit a new application
router.post('/', async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Get all applications (Admin view)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Get a single application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({ applicationId: req.params.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Run Audit for an application
router.post('/:id/audit', async (req, res) => {
  try {
    const application = await Application.findOne({ applicationId: req.params.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const auditResult = runFullAudit(application);
    
    // Update application with results
    application.complianceResult = auditResult;
    application.status = auditResult.decision === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW';
    
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
