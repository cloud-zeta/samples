const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = async () => {
    return {
        entry: "./index.js",
        output: {
            // Note the public path is not really needed for this example.
            path: path.resolve(__dirname, "public"),
            filename: "not-used.js",
        },

        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "index.*"),
                        to: path.join(__dirname, "public/index[ext]"),
                    },
                    {
                        from: path.resolve(__dirname, "node_modules/@cloudzeta/engine"),
                        to: path.join(__dirname, "public/zetaEngine"),
                    },
                    {
                        from: path.resolve(__dirname, "node_modules/@cloudzeta/wasm"),
                        to: path.join(__dirname, "public/zetaWasm"),
                    },
                ]
            }),
        ],

        devServer: {
            compress: true,
            port: 8848,

            onBeforeSetupMiddleware: function (devServer) {
                devServer.app.get("*", (req, res, next) => {
                    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
                    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
                    res.setHeader("Access-Control-Allow-Origin", "*");

                    // Continue to the next middleware/handler
                    next();
                });
            },
        },
    };
}
