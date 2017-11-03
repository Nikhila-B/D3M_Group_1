var path = require('path');

const config = {
    entry: "./app/App.jsx",
    output: {
        filename: "app.js",
        path: path.join(__dirname, "public")
    },

    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },

    module: {
        rules: [
            { test: /\.jsx?$/, loader: ["babel-loader"] }
        ]
    }
};

module.exports = config;