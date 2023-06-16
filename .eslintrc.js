module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true 
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    },
    "globals": {
        "$": "readonly",
        "cBrowser":"readonly",
        "cDebug": "readonly",
        "bean": "readonly",
        "cQueue": "readonly",
        "cHttp2": "readonly",
        "ga": "readonly",
        "cSecret": "readonly",
        "cLocations": "readonly",
        "cHttp": "readonly",
        "set_status": "readonly",
        "cHttpQueue": "readonly",
        "cHttpQueueItem": "readonly",
        "google": "readonly",
        "set_error_status": "readonly",
        "jQuery": "readonly",
        "cJquery": "readonly"
    }

}
