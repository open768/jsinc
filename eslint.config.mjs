// eslint.config.js
import globals from "globals"
import js from "@eslint/js"

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.jquery,
				...globals.browser,
				bean: "readonly",
				cAppLocations: "readonly",
				cAuth: "readonly",
				cBrowser: "readonly",
				cDebug: "readonly",
				cDetail: "readonly",
				cHttp2: "readonly",
				cHttpQueue: "readonly",
				cHttpQueueItem: "readonly",
				cJquery: "readonly",
				cMission: "readonly",
				cQueue: "readonly",
				cSecret: "readonly"
			}
		},
		rules: {
			"no-unused-vars": "warn",
			semi: "off"
		},
		ignores: ["**\\extra\\"]
	}
]
