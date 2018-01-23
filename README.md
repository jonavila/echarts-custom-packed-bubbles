# zoomdata-chart-webpack-starter

[![Greenkeeper badge](https://badges.greenkeeper.io/jonavila/zoomdata-chart-webpack-starter.svg)](https://greenkeeper.io/)
A starter kit for for building a Zoomdata Custom Chart, featuring Webpack
![2017-11-01_09-29-09](https://user-images.githubusercontent.com/5589281/32281569-94efe688-bef5-11e7-8c4d-83e9448ad6a2.png)

### Prerequisites
You need to download  and configure the zoomdata-chart-cli from npm
```
npm install zoomdata-chart-cli -g
zd-chart-cli config
# follow the prompts in the CLI to complete the configuration
```

### Usage

```bash
# Pull a Zoomdata custom chart based off of a Blank template using the zoomdata-chart-cli
zd-chart pull MYCUSTOMCHART

# Clone this repo into the newly created custom chart directory
cd CUSTOMCHARTDIR
git clone --no-checkout https://github.com/jonavila/zoomdata-chart-webpack-starter.git tmp && mv tmp/.git . && rmdir tmp && git reset --hard HEAD

# Run npm install and write your chart name when asked. That's all!
npm install
```

**Start coding!** `package.json` and entry files are already set up for you. Just keep those files with the same names.

### Features

 - Zero-setup. After running `npm install` things will be setup for you :wink:
 - **[Webpack](https://webpack.js.org/)** for development and production builds using [configuration composition](https://survivejs.com/webpack/developing/composing-configuration/).
 - **[babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env)** to compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills you need based on your targeted browser or runtime environments.
 - **[babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/)** to transforms es2015 static class properties as well as properties declared with the es2016 property initializer syntax.
 - **[babel-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/)** to transform rest properties for object destructuring assignment and spread properties for object literals.
 - **[Prettier](https://github.com/prettier/prettier)** for code formatting.

### NPM scripts

 - `npm start`: Generates the development bundle. Webpack will run in [watch mode](https://webpack.js.org/configuration/watch/)
 - `npm run build`: Generate the production bundle. All of the code in chart's components folder will be minified

### Git Hooks

There is already set a `precommit` hook for formatting your code with Prettier :nail_care:

### FAQ

#### `Array.prototype.from`, `Promise`, `Map`... is undefined?

Babel only provides down-emits on syntactical features (`class`, `let`, `async/await`...), but not on functional features (`Array.prototype.find`, `Set`, `Promise`...), . For that, you need Polyfills, such as [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/).

```javascript
import "babel-polyfill/core-js/modules/es6.promise";
import "babel-polyfill/core-js/modules/es6.map";
...
```

#### What is `npm install` doing when I run it for the first time?

It runs the script `tools/init` which sets up everything for you. In short, it:
 - Configures Webpack with development and production configurations, which create the bundles.
 - Configures `package.json`
 - Renames index.js and index.css src files

## Resources

- [Zoomdata Chart CLI](https://github.com/jonavila/zoomdata-chart-cli)
- [Creating a Custom Chart in Zoomdata](https://www.zoomdata.com/docs/2.6/creating-a-custom-chart-template.html)

## Credits

Inspired and heavily borrowed from the work of [@alexjoverm](https://twitter.com/alexjoverm) in [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)
