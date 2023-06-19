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
        "bean": "readonly",
        "cBrowser":"readonly",
        "cDebug": "readonly",
        "cHttp": "readonly",
        "cHttp2": "readonly",
        "cHttpQueue": "readonly",
        "cHttpQueueItem": "readonly",
        "cJquery": "readonly",
        "cLocations": "readonly",
        "cQueue": "readonly",
        "cSecret": "readonly",
        "ga": "readonly",
        "google": "readonly",
        "jQuery": "readonly",
        "set_error_status": "readonly",
        "set_status": "readonly"
    }

}
