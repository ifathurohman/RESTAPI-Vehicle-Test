const { Ability, AbilityBuilder } = require('@casl/ability');

function getToken(req) {
    let token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

    return token && token.length ? token : null;
}

const policies = {
    false(user, { can }) {
        can('view', 'vehicle brand', { user_id: user.id });
        can('read', 'vehicle brand', { user_id: user.id });
        can('view', 'vehicle type', { user_id: user.id });
        can('read', 'vehicle type', { user_id: user.id });
        can('view', 'vehicle model', { user_id: user.id });
        can('read', 'vehicle model', { user_id: user.id });
        can('view', 'vehicle price', { user_id: user.id });
        can('read', 'vehicle price', { user_id: user.id });
        can('view', 'vehicle year', { user_id: user.id });
        can('read', 'vehicle year', { user_id: user.id });
    },
    true(user, { can }) {
        can('manage', 'all')
    }
};

const policyFor = user => {
    let builder = new AbilityBuilder();
    if (user && typeof policies[user.is_admin] === 'function') {
        policies[user.is_admin](user, builder);
    } else {
        policies['guest'](user, builder);
    }

    return new Ability(builder.rules);
};

module.exports = {
    getToken,
    policyFor,
};