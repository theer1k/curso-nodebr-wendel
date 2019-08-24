const assert = require('assert');
const api = require('./../src/api');

let app = {};
const MOCK_HERO_CREATE = {
    nome: 'Negers',
    poder: 'Marretada'
}

const MOCK_HERO_UPDATE = {
    nome: 'Kuthuflas',
    poder: 'Raios'
}

let MOCK_ID = '';

describe('suite tests for api /heroes', function () {
    this.beforeAll(async () => {
        app = await api;

        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: JSON.stringify(MOCK_HERO_UPDATE)
        });

        const data = JSON.parse(result.payload);
        MOCK_ID = data._id;
    });

    it('should list /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        });

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });

    it('should /heroes return only 10 heroes', async () => {
        const LIMIT = 3;

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT}`
        })

        const data = JSON.parse(result.payload);

        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(data.length === LIMIT)
    });

    it('should /heroes return limit error', async () => {
        const LIMIT = 'ASEDASD';

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT}`
        })

        const error = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": [
                    "limit"
                ]
            }
        }

        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 400);
        assert.ok(result.payload, JSON.stringify(error));
    });


    it('should filter by name on GET /heroes', async () => {
        const LIMIT = 1000;
        const NAME = 'Batman';

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT}&nome=${NAME}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(data[0].nome === NAME);
    });

    it('should return limit error on GET with parameters /heroes', async () => {
        const LIMIT = 'ASEDASD';

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT}`
        })

        const error = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": [
                    "limit"
                ]
            }
        }

        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 400);
        assert.ok(result.payload, JSON.stringify(error));
    });


    it('should filter by name on GET /heroes', async () => {
        const LIMIT = 1000;
        const NAME = 'Batman';

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT}&nome=${NAME}`
        })

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(data[0].nome === NAME);
    });

    it('should create a hero on POST /heroes', async () => {

        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: JSON.stringify(MOCK_HERO_CREATE)
        })

        const { message, _id } = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Hero created successfully.");
    });

    it('should update a hero on PATCH /heroes/:id', async () => {
        const _id = MOCK_ID;

        const expected = {
            poder: 'Super Mira'
        };

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const { message } = JSON.parse(result.payload);

        const statusCode = result.statusCode;
        assert.ok(statusCode === 200);
        assert.deepEqual(message, "Hero updated successfully.");
    });

    it('should not update a hero on PATCH /heroes/:id with incorrect _id', async () => {
        const _id = '5d5df648d4c9ff34b87d0f78';

        const expected = {
            poder: 'Super Mira'
        };

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })


        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        const expectedResponse = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Not found in database.'
        };

        assert.ok(statusCode === expectedResponse.statusCode);
        assert.deepEqual(data, expectedResponse);
    });

    it('should delete on /heroes/:id DELETE', async () => {
        const _id = MOCK_ID;

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, "Hero deleted successfully.");
    });

    it('should not delete on /heroes/:id DELETE', async () => {
        const _id = '5d5df648d4c9ff34b87d0f78';

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        const expectedResponse = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Not found in database.'
        };

        assert.ok(statusCode === expectedResponse.statusCode);
        assert.deepEqual(data, expectedResponse);
    });
});