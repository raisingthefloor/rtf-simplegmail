const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let result;
    if(authHeader){
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const options = {
            expiresIn: '364d',
            issuer: process.env.FRONT_URL
        };

        try {
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, process.env.JWT_SECRET, options);

            // Let's pass back the decoded token to the request object
            req.user = result;
            // We call next to pass execution to the subsequent middleware
            next();
        } catch (err) {
            result = {
                status: false,
                data: null,
                message: `Authentication Failed`
            }
            res.status(401).send(result);
        }
    }
}