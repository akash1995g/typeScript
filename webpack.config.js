var path = require("path")
module.exports = {
    mode:"none",
    entry: './src/app.ts',
    output : {
        // filename: "bundle.[contenthash].js", // for create bundle hash for cache 
        filename: "bundle.js", // can be any name
        path: path.resolve(__dirname,"dist"),
        publicPath: '/dist/' // for webpack dev server

    },
    devtool:"inline-source-map",
    module:{
        rules:[
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        extensions: [".ts",".js"]
    }
}