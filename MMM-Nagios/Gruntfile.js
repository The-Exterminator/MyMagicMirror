module.exports = function(grunt) {
	require("time-grunt")(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			main: {
				options: {
					configFile: ".eslintrc.json",
				},
				src: ["*.js"]
			}
		},
		stylelint: {
			simple: {
				options: {
					configFile: ".stylelintrc"
				},
				src: ["*.css"]
			}
		},
		jsonlint: {
			main: {
				src: ["package.json", ".eslintrc.json", ".stylelint"],
				options: {
					reporter: "jshint"
				}
			}
		},
		markdownlint: {
			all: {
				options: {
					config: {
						"default": true,
						"MD013": {"tables": false},
						"MD033": {"allowed_elements": ["br"]}
					}
				},
				src: ["*.md"]
			}
		},
		yamllint: {
			all: [".travis.yml"]
		}
	});
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-stylelint");
	grunt.loadNpmTasks("grunt-jsonlint");
	grunt.loadNpmTasks("grunt-markdownlint");
	grunt.loadNpmTasks("grunt-staged");
	grunt.registerTask("default", ["eslint", "jsonlint", "markdownlint"]);
	grunt.registerTask("precommit", ["staged:eslint", "staged:jsonlint", "staged:markdownlint"]);
};
