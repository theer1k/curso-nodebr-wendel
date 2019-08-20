function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

module.exports = mapRoutes;