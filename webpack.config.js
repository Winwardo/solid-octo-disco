module.exports = {
    'entry': __dirname + '/src/index.js',

    'output': {
        'path': __dirname + '/public',
        'filename': 'bundle.js'
    },

    'module': {
        'loaders': [{
            'test': /\.jsx?$/,
            'exclude': /(node_modules|bower_components)/,
            'loader': 'babel',
            'query': {
                'presets': ['react', 'es2015']
            }
        }, {
            'test': /\.json$/,
            'loader': 'json-loader'
        }]
    },

    'resolve': {
        'extensions': ['', '.js', '.jsx', '.json']
    },

    node: {
        'fs': "empty",
        'tls': 'empty'
    }
};