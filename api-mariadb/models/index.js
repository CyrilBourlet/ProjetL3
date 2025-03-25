const { Sequelize } = require('sequelize');
require('dotenv').config(); // charge les variables d'environnement depuis le fichier .env

// Connexion à la base de données avec Sequelize
const sequelize = new Sequelize(
    process.env.DB_DATABASE, // nom de la base
    process.env.DB_USER,     // utilisateur
    process.env.DB_PASSWORD, // mot de passe
    {
        host: process.env.DB_HOST, // adresse du serveur
        port: process.env.DB_PORT, // port de connexion
        dialect: 'mariadb',        // type de base de données
        logging: false             // désactive l'affichage des requêtes SQL
    }
);

// Importation des modèles
const Joueur = require('./Joueur')(sequelize);
const Tournoi = require('./Tournoi')(sequelize);
const Inscription = require('./Inscription')(sequelize);
const Serie = require('./Serie')(sequelize);
const SerieIn = require('./SerieIn')(sequelize);

// Définition des relations entre les modèles

// Un joueur peut participer à plusieurs tournois via les inscriptions
Joueur.belongsToMany(Tournoi, { through: Inscription, foreignKey: 'licence_joueur' });
Tournoi.belongsToMany(Joueur, { through: Inscription, foreignKey: 'id_tournoi' });

// Une série peut exister dans plusieurs tournois via SerieIn
Serie.belongsToMany(Tournoi, { through: SerieIn, foreignKey: 'id_serie' });
Tournoi.belongsToMany(Serie, { through: SerieIn, foreignKey: 'id_tournoi' });

// Relations directes sur SerieIn (liaison entre Série et Tournoi)
SerieIn.belongsTo(Serie, { foreignKey: 'id_serie' });
SerieIn.belongsTo(Tournoi, { foreignKey: 'id_tournoi' });
Serie.hasMany(SerieIn, { foreignKey: 'id_serie' });
Tournoi.hasMany(SerieIn, { foreignKey: 'id_tournoi' });

// Relations sur Inscription
Inscription.belongsTo(Joueur, { foreignKey: 'licence_joueur' });
Joueur.hasMany(Inscription, { foreignKey: 'licence_joueur' });

Inscription.belongsTo(Tournoi, { foreignKey: 'id_tournoi' });
Tournoi.hasMany(Inscription, { foreignKey: 'id_tournoi' });

Inscription.belongsTo(Serie, { foreignKey: 'id_serie' }); // relation entre Inscription et Serie
Serie.hasMany(Inscription, { foreignKey: 'id_serie' });

module.exports = { sequelize, Joueur, Tournoi, Inscription, Serie, SerieIn };
