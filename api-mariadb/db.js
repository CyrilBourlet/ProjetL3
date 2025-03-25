const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

// Connexion à la base de données
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, // hôte de la base de données
    port: config.port, // port utilisé pour la connexion
    dialect: config.dialect, // type de base de données (ici, mariadb)
    logging: false // désactive l'affichage des requêtes SQL dans la console
});

// Vérifie que la connexion fonctionne
sequelize.authenticate()
    .then(() => { /* connexion réussie */ })
    .catch(err => { /* erreur de connexion */ });

module.exports = sequelize; // exporte l'objet sequelize pour l'utiliser ailleurs
