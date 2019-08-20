const Happi = require('hapi');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroSchema');
const HeroRoute = require('./routes/heroRoutes');
const mapRoutes = require('./helpers/mapRoutes');

const app = new Happi.Server({
    port: 5000
});

async function main() {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroesSchema));

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ]);

    await app.start();
    console.log(`Server running on: http://localhost:${app.info.port}`);

    return app;
}

module.exports = main();