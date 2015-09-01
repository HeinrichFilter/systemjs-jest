# systemjs-jest

[SystemJS Builder](https://github.com/systemjs/builder) [jest](https://github.com/facebook/jest) plugin

## Rationale

Jest is primarily intended as a unit testing framework that mocks CommonJS modules. In order to use
the ES6 module loader, [SystemJS](https://github.com/systemjs/systemjs) and [JSPM](http://jspm.io/)
are somewhat necessary right now. This plugin is a stopgap that preprocesses jest unit tests using
the [SystemJS Builder](https://github.com/systemjs/builder).

### Example

Jest is made to work with dependencies that are installed via npm. The
[babel-jest](https://github.com/babel/babel-jest) package would seem like a good solution, but
a jest test trying to load dependencies installed with JSPM will fail:

```bash
jspm install chai=npm:chai
```

```js
// example-spec.js
import {expect} from 'chai'; // doesn't work! jest can't find the module
```

## Usage

First install the plugin:

```bash
npm install --save-dev systemjs-jest
```

Then, in your "jest" section in package.json, add the following:

```json
{
  "jest": {
    "scriptPreprocessor": "systemjs-jest"
  }
}
```

Now your import statements will magically work like they're supposed to!

## Caveats

Sidestepping the CommonJS module loader also means that the mocking capabilities in Jest don't work
with modules that are brought in using "import" statements. For a demonstration of how to
mock/stub/spy on things that are using the SystemJS loader, see
[this example](https://github.com/curran/jspm-mocha-example/blob/master/test/tests.js). Ideally in
the future, Jest would just configure the ES6 loader in this manner and this plugin wouldn't be
necessary.

## Special Thanks

This project was mostly inspired by [babel-jest](https://github.com/babel/babel-jest).
