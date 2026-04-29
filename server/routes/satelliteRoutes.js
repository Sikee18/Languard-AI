import express from 'express';
import { analyzeLand, analyzeElevation } from '../services/satelliteService.js';

const router = express.Router();

router.get('/scan', (req, res) => {
  const { coords, elevation } = req.query;
  
  if (!coords) return res.status(400).json({ message: 'Coordinates required' });

  const result = {
    satellite: analyzeLand(coords)
  };

  if (elevation === 'true') {
    result.elevation = analyzeElevation(coords);
  }

  res.json(result);
});

export default router;
