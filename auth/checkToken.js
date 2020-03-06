
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {

    
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const decodedUser = jwt.verify(token, 'privatekey');
            // console.log("decodedUser>>>",decodedUser)
            req.user=decodedUser
            next();
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied.'
            });
        }
    }
    else{
        return res.json({
            success: false,
            message: 'Invalid token.'
        });
    }
    //console.log("decoded>>>>", decodedUser);
    
};
module.exports = checkToken