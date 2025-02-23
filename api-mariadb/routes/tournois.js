const express = require('express');
const router = express.Router();
const db = require('../db'); // Vérifie que db.js existe

// Récupérer tous les tournois
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Tournois;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});

module.exports = router;
