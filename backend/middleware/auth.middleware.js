const userModel = require('../models/usermodel')
const userParticipantModel = require('../models/userpart.model')
const blacklistTokenModel = require('../models/blacklistToken.model')
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or already logged out"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'unauthorized' })
    }
}

module.exports.authUserPart = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or already logged out"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userParticipantModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'unauthorized' })
    }
}