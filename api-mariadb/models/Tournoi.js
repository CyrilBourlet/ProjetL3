const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Tournoi', {
        id_tournoi: { 
            type: DataTypes.INTEGER,        // identifiant unique du tournoi
            primaryKey: true,               // clé primaire
            autoIncrement: true             // s'incrémente automatiquement
        },
        nom_tournoi: { 
            type: DataTypes.STRING,         // nom du tournoi
            allowNull: false                // obligatoire
        },
        datedebut_tournoi: { 
            type: DataTypes.DATEONLY,       // date de début du tournoi (sans heure)
            allowNull: false
        },
        datefin_tournoi: { 
            type: DataTypes.DATEONLY,       // date de fin du tournoi (sans heure)
            allowNull: false
        },
        lieu_tournoi: { 
            type: DataTypes.STRING,         // lieu où se déroule le tournoi
            allowNull: false
        }
    }, {
        tableName: 'Tournois',              // nom de la table dans la base
        timestamps: false                   // pas de colonnes createdAt et updatedAt
    });
};
