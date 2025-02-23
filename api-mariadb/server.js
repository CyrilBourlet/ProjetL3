const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Importer les routes API
const tournoiRoutes = require('./routes/tournois');
app.use('/api/tournois', tournoiRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const connexionRoutes = require('./routes/connexion'); // Ajout de la route de connexion
app.use('/api/login', connexionRoutes);

const inscritsRoutes = require('./routes/inscrits');
app.use('/api/inscrits', inscritsRoutes);

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Page non trouvée" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur http://localhost:${port}`);
});
