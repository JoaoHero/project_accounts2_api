const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = {
    eAdmin: async function (req, res, next) {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                error: true,
                message: "Necessário fazer o login para acessar esta página"
            });
        };

        const [, token ] = authHeader.split(" ");
        
        if(!token) {
            return res.status(401).json({
                error: true,
                message: "Necessário fazer o login para acessar esta página"
            });
        };

        try{
            const decode = await promisify(jwt.verify)(token, "ATROS190KHSGZXCVWERGHXQGY");
            
            let userInfo = {
                id: decode.id,
                name: decode.name
            }

            req.user = userInfo

            return next();

        }catch(err) {
            return res.status(401).json({
                error: true,
                message: "Necessário fazer o login para acessar esta página"
            });
        }
    }
};