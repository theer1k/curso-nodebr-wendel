const assert = require('assert');
const api = require('./../src/api');

describe('suite tests for api /heroes', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('should list /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=1000'
        });
        
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });

    it('should /heroes must return only 10 heroes', async () => {
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

    it('should /heroes filter by name', async () => {
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
});