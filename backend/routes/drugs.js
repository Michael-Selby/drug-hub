const express = require('express');
const router = express.Router();
const Drug = require('../models/Drug');

// GET all drugs
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    const drugs = await Drug.find(filter).sort({ createdAt: -1 });
    res.json(drugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET expiring drugs (within next N days, default 30)
router.get('/expiring', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(now.getDate() + days);

    const drugs = await Drug.find({
      expiryDate: { $gte: now, $lte: threshold },
    }).sort({ expiryDate: 1 });

    res.json(drugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single drug
router.get('/:id', async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json(drug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create drug
router.post('/', async (req, res) => {
  try {
    const drug = new Drug(req.body);
    const saved = await drug.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update drug
router.put('/:id', async (req, res) => {
  try {
    const drug = await Drug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json(drug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE drug
router.delete('/:id', async (req, res) => {
  try {
    const drug = await Drug.findByIdAndDelete(req.params.id);
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json({ message: 'Drug deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
