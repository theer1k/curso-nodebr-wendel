const BaseRoute = require('./base/baseRoute');

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;

                    let query = {};
                    if (nome) {
                        query.nome = nome;
                    }

                    if (isNaN(skip)) {
                        throw Error('skip type incorrect')
                    }

                    if (isNaN(limit)) {
                        throw Error('skip type incorrect')
                    }

                    return this.db.read(query, parseInt(skip, null), parseInt(limit, null));
                } catch (err) {
                    console.error(err);

                    return 'Internal server error'
                }
            }
        }
    }
}

module.exports = HeroRoutes;