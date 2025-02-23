const express = require('express');
const router = express.Router();
const db = require('../db');

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Joueurs;"); // Assure-toi que "Joueurs" est bien la table correcte
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});

// Ajouter un utilisateur
router.post('/', async (req, res) => {
  const { nom_joueur, prenom_joueur, mail_joueur } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO Joueurs (nom_joueur, prenom_joueur, mail_joueur) VALUES (?, ?, ?)",
      [nom_joueur, prenom_joueur, mail_joueur]
    );
    res.json({ id: result.insertId, nom_joueur, prenom_joueur, mail_joueur });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});

module.exports = router;
