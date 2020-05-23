var config = {
    secretKey: "ZheBoShiRouDanCongJi",
    db: {
        host: 'localhost',
        user: 'root',
        password: 'WLX643204',
        port: '3306',
        database: 'questionnaire_system'
    }
};

module.exports.secretKey = config.secretKey;
module.exports.db = config.db;