var path = require("path")
var CleanPlugin = require("clean-webpack-plugin")
module.exports = {
    mode:"production",
    entry: './src/app.ts',
    output : {
        // filename: "bundle.[contenthash].js", // for create bundle hash for cache 
        filename: "bundle.js", // can be any name
        path: path.resolve(__dirname,"dist"),

    },
    devtool:"none",
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
    },
    plugins:[
        new CleanPlugin.CleanWebpackPlugin()
    ]
}