const apiInfo = (req, res) => {
    res.status(200).json({
        title: 'Code, life, Modafinil API',
        version: 'Alpha v0.1'
    });
};

module.exports = {
    apiInfo
};