const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, error) => {
    throw error;
};

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                validate: {
                    failAction: failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload;

                    const result = await this.db.create({ nome, poder });

                    return {
                        message: 'Hero created successfully.',
                        _id: result._id
                    }
                } catch (err) {
                    console.error(err);

                    return Boom.internal();
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction: failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { id } = request.params;

                    const result = await this.db.delete(id);

                    if (result.n !== 1) {
                        return Boom.preconditionFailed('Not found in database.');
                    }

                    return {
                        message: 'Hero deleted successfully.'
                    }
                } catch (err) {
                    console.error(err);

                    return Boom.internal();
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    failAction: failAction,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;

                    const data = JSON.parse(JSON.stringify(payload))
                    const result = await this.db.update(id, data);

                    if (result.nModified !== 1) {
                        return Boom.preconditionFailed('Not found in database.');
                    }

                    return {
                        message: 'Hero updated successfully.'
                    }
                } catch (err) {
                    console.error(err);

                    return Boom.internal();
                }
            }
        }
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config: {
                validate: {
                    failAction: failAction,
                    query: {
                        skip: Joi.number().integer().default(10),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;

                    const query = nome ? {
                        nome:
                            { $regex: `.*${nome}*.` }
                    } : {}

                    return this.db.read(nome ? query : {}, skip, limit);
                } catch (err) {
                    console.error(err);

                    return Boom.internal();
                }
            }
        }
    }
}

module.exports = HeroRoutes;