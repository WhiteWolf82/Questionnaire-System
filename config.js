var config = {
    secretKey: "ZheBoShiRouDanCongJi",
    db: {
        host: 'localhost',
        user: 'xxx',
        password: 'xxxxxx',
        port: '3306',
        database: 'questionnaire_system'
    }
};

module.exports.secretKey = config.secretKey;
module.exports.db = config.db;
