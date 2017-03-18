import {projectCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const pkgJsonFilePath =     "/package.json";
const tsconfigFilePath =    "/tsconfig.json";
const webpackFilePath =     "/webpack.config.js";
const indexHtmlFilePath =   "/app/index.html";
const indexTsxFilePath =    "/app/index.tsx";

const moduleFilePath =      "/app/modules/MyProject/MyProject.module.ts";
const stylesFilePath =      "/app/modules/MyProject/MyProject.scss";
const componentFilePath =   "/app/modules/MyProject/MyProject.component.ts";
const viewFilePath =        "/app/modules/MyProject/MyProject.view.tsx";
const typesFilePath =       "/app/modules/MyProject/MyProject.types.ts";

test("creates project with all default files", () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    expect(fileExists(pkgJsonFilePath)).toBeTruthy();
    expect(fileExists(tsconfigFilePath)).toBeTruthy();
    expect(fileExists(webpackFilePath)).toBeTruthy();
    expect(fileExists(indexHtmlFilePath)).toBeTruthy();
    expect(fileExists(indexTsxFilePath)).toBeTruthy();

    expect(fileExists(moduleFilePath)).toBeTruthy();
    expect(fileExists(stylesFilePath)).toBeTruthy();
    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeTruthy();
});

test("creates project without module", () => {
    projectCommand("MyProject", "1.0", true, false, false, false, false);

    expect(fileExists(pkgJsonFilePath)).toBeTruthy();
    expect(fileExists(tsconfigFilePath)).toBeTruthy();
    expect(fileExists(webpackFilePath)).toBeTruthy();
    expect(fileExists(indexHtmlFilePath)).toBeTruthy();
    expect(fileExists(indexTsxFilePath)).toBeTruthy();

    expect(fileExists(moduleFilePath)).toBeFalsy();
    expect(fileExists(stylesFilePath)).toBeFalsy();
    expect(fileExists(componentFilePath)).toBeFalsy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test('created package.json file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(pkgJsonFilePath);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
{
  "name": "myproject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "./node_modules/.bin/webpack",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "jquery": "^3.1.1",
    "react": "^15.4.2",
    "react-dom": "^15.4.2"
  },
  "devDependencies": {
    "@types/react": "^15.0.16",
    "@types/react-dom": "^0.14.23",
    "@types/jquery": "^2.0.41",
    "awesome-typescript-loader": "^3.1.2",
    "css-loader": "^0.27.1",
    "extract-text-webpack-plugin": "^2.1.0",
    "glob": "^7.1.1",
    "node-sass": "^4.5.0",
    "rts-fw": "1.0",
    "sass-loader": "^6.0.3",
    "source-map-loader": "^0.2.0",
    "style-loader": "^0.13.2",
    "typescript": "^2.2.1",
    "webpack": "^2.2.1"
  }
}  
`;
    expect(data).toBe(expectedComponentText);
});

test('created tsconfig.json file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(tsconfigFilePath);

    let expectedComponentText = `\
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react"
  },
  "include": [
    "./app/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created webpack.config.js file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(webpackFilePath);

    let expectedComponentText = `\
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require("glob");

let entries = {
    app: "./app/index.tsx"
};

let locations = glob.sync("./app/modules/*/*.module.ts");
for (let g of locations) {
    let name = g.replace("./app/modules/", "").replace(".module.tsx").split("/")[0];
    process.stdout.write("module: " + name + " @ " + g);
    entries[name] = g;
}

module.exports = {
    entry: entries,

    output: {
        filename: "js/[name].bundle.js",
        path: __dirname + "/dist"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\\.tsx?$/,
                use: "awesome-typescript-loader"
            },
            {
                test: /\\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader",
                })
            },
            {
                test: /\\.js$/,
                enforce: "pre",
                use: "source-map-loader"
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new CheckerPlugin(),
        new ExtractTextPlugin('styles/[name].bundle.css')
    ]
};
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.html file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(indexHtmlFilePath);

    let expectedComponentText = `\
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>MyProject</title>
        </head>
    <body>
        <main id="content">
            <p>Loading...</p>
        </main>
        
        <!-- Dependencies -->
        <script src="../node_modules/jquery/dist/jquery.js"></script>
        <script src="../node_modules/react/dist/react.js"></script>
        <script src="../node_modules/react-dom/dist/react-dom.js"></script>
        
        <!-- Main -->
        <script src="../dist/js/app.bundle.js"></script>
    </body>
</html>
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.tsx file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(indexTsxFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactDom from "react-dom";
import {App} from "rts-fw";
import Manifest from "./module.manifest";

const MyProject = new App(Manifest); 
`;
    expect(data).toBe(expectedComponentText);
});
