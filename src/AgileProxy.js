module.exports = {
    Proxy: require('./AgileProxy/proxy')
};
if (typeof window !== 'undefined') {
    window.AgileProxy = module.exports;
}

