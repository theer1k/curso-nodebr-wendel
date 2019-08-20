const assert = require('assert');
const api = require('./../src/api');

describe('suite tests for api /heroes', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('list /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        });
        
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });
});