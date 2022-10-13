var path = require("path")
module.exports = {
    entry: './src/app.ts',
    output : {
        // filename: "bundle.[contenthash].js", // for create bundle hash for cache 
        filename: "bundle.js", // can be any name
        path: path.resolve(__dirname,"dist")
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