const express = require('express'); // Framework pour créer le serveur HTTP
const cors = require('cors'); // Middleware pour autoriser les requêtes cross-origin
const path = require('path'); // Module pour gérer les chemins de fichiers
const { sequelize } = require('./models'); // Import de l'instance Sequelize connectée à la base

const app = express(); // Création de l'application Express

// Active CORS pour permettre les requêtes depuis d'autres origines
app.use(cors());

// Permet de lire les données JSON envoyées dans le corps des requêtes
app.use(express.json());

// Import des routes spécifiques et association à des chemins d'API
const tournoiRoutes = require('./routes/tournois');
app.use('/api/tournois', tournoiRoutes);

const connexionRoutes = require('./routes/connexion');
app.use('/api/login', connexionRoutes);

const inscritsRoutes = require('./routes/inscrits');
app.use('/api/inscrits', inscritsRoutes);

const seriesRoutes = require('./routes/series');
app.use('/api/series', seriesRoutes);

// Sert les fichiers statiques du dossier "public" (pages HTML, CSS, JS côté client)
app.use(express.static(path.join(__dirname, 'public')));

// Synchronisation de la base de données avec les modèles Sequelize
sequelize.sync()
    .then(() => console.log("Base de données synchronisée avec Sequelize"))
    .catch(err => console.error("Erreur de synchronisation :", err));

// Gestion des routes non trouvées : retourne une erreur 404 en JSON
app.use((req, res) => {
    res.status(404).json({ message: "Page non trouvée" });
});

// Définition du port d'écoute du serveur (par défaut 3000 si non spécifié)
const port = process.env.PORT || 3000;

// Middleware pour demander au navigateur de vider le stockage (localStorage, sessionStorage)
app.use((req, res, next) => {
    res.setHeader("Clear-Site-Data", '"storage"');
    next();
});

// Route de base "/" redirige vers la page d'accueil du site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Accueil.html'));
});

// Démarrage du serveur et écoute sur le port défini
app.listen(port, () => {
    console.log(`Serveur API démarré sur http://localhost:${port}`);
});
