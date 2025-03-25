const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class SerieIn extends Model {} // création du modèle SerieIn

    SerieIn.init({
        id_tournoi: { 
            type: DataTypes.INTEGER,        // identifiant du tournoi concerné
            allowNull: false,               // obligatoire
            references: {                   // clé étrangère vers la table Tournois
                model: 'Tournois',
                key: 'id_tournoi'
            }
        },
        id_serie: { 
            type: DataTypes.INTEGER,        // identifiant de la série concernée
            allowNull: false,               // obligatoire
            references: {                   // clé étrangère vers la table Series
                model: 'Series',
                key: 'id_serie'
            }
        }
    }, {
        sequelize,                          // instance de Sequelize utilisée
        modelName: 'SerieIn',               // nom du modèle
        tableName: 'SerieIn',               // nom de la table dans la base
        timestamps: false                   // désactive createdAt et updatedAt
    });

    return SerieIn; // export du modèle
};
