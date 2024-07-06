const { getToken, policyFor } = require('../utils');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/models/Users');

function decodeToken() {
    return async function (req, res, next) {
        try {
            let token = getToken(req);

            if (!token) return next();
            req.user = jwt.verify(token, config.secretKey);
            let user = await User.findOne({
                token: {
                    $in: [token],
                },
            });

            if (!user) {
                res.status(401),
                    res.json({
                        error: 1,
                        message: 'Token Expired',
                    });
                return;
            }
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return (
                    res.status(401),
                    res.json({
                        error: 1,
                        message: err.message,
                    })
                );
            }

            next(err);
        }

        return next();
    };
}

function police_check(action, subject) {
    return function (req, res, next) {
        let policy = policyFor(req.user);

        if (!policy.can(action, subject)) {
            return res.json({
                error: 1,
                message: 'You are not allowed to ' + action + ' ' + subject,
            });
        }
        next();
    };
}

const ensureAuthenticated = async (req, res, next) => {
    let token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.secretKey);

        req.user = await User.findById(decoded._id).select(
            '-password -token -__v -createdAt -updatedAt -cart_items',
        );

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = {
    decodeToken,
    police_check,
    ensureAuthenticated,
};
