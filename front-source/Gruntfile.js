const {VueLoaderPlugin} = require('vue-loader'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    fs = require("fs"),
    path = require("path"),
    util = {
        isDir: function (file) {
            return fs.lstatSync(file).isDirectory();
        },
        endWith: function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },
        dirName: function (file, step) {
            var baseDir, length, tmp;
            if (!step) {
                step = 1;
            }
            if (this.isDir(file)) {
                baseDir = file;
            } else {
                baseDir = path.dirname(file);
            }
            tmp = baseDir.split(path.sep);
            length = tmp.length;
            if (length > 0) {
                return tmp[length - step];
            }
            return "";
        },
        baseName: function (file, ext) {
            if (!ext) {
                return path.basename(file);
            }
            return path.basename(file, "." + ext);
        },
        initProject: function (devPath) {
            var dir, dirs, i, len;
            fs.mkdirSync(devPath);
            dirs = ["vue", "sass", "debug", "build"];
            for (i = 0, len = dirs.length; i < len; i++) {
                dir = devPath + dirs[i];
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
            }
        }
    };

function optimization(mode) {
    if (mode === "production") {
        return {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false, // set to true if you want JS source maps
                    uglifyOptions: {
                        mangle: {
                            toplevel: false,
                        },
                        output: {
                            ascii_only: true
                        },
                        compress: {
                            global_defs: {
                                'DEBUG': false
                            },
                            unused: true,
                            toplevel: true,
                            drop_debugger: true,
                            drop_console: true,
                            dead_code: true
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        }
    }
    return {}
}

function getWebpack(devPath, taskName) {
    let webpackConfig = {
        context: null,
        mode: "production",
        entry: {},
        output: {
            filename: '[name].js'
        },
        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                allChunks: false,
            })
        ],
        resolve: {
            extensions: [".vue", ".js", ".json"]
        },
        module: {
            noParse: /Vue|jquery/,
            rules: [
                {
                    test: /\.m?js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [["@babel/preset-env", {"modules": false}]],
                            plugins: ['@babel/plugin-proposal-object-rest-spread', "@babel/plugin-transform-runtime",
                                ["import", {"libraryName": "mand-mobile", "libraryDirectory": "lib"}, "mand-mobile"],
                                ["component", {
                                    "libraryName": "element-ui",
                                    "libraryDirectory": "lib",
                                    "styleLibraryName": "theme-chalk"
                                }, "element-ui"]]
                        }
                    }
                }, {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                }
            ]
        }
    };
    let basename, file, i, len, sourceList, vuePath,
        mode = taskName === "start" ? "development" : "production";
    vuePath = devPath + "vue";
    webpackConfig.mode = mode;
    webpackConfig.context = vuePath;
    webpackConfig.optimization = optimization(mode);
    sourceList = fs.readdirSync(vuePath);
    for (i = 0, len = sourceList.length; i < len; i++) {
        file = sourceList[i];
        if (file.indexOf(".js") === -1) {
            continue;
        }
        basename = path.basename(file);
        basename = basename.substr(0, basename.length - 3);
        webpackConfig.entry[basename] = vuePath + "/" + file;
    }
    if (mode === "development") {
        webpackConfig.output.path = devPath + 'debug/js';
    } else {
        webpackConfig.output.path = devPath + 'build/js';
    }
    return webpackConfig;
}

module.exports = function (grunt) {
    let cf, configFile, currentProject, debugPath, devPath, globalConfig, relPath, sep,
        taskName, webpackConfig, i, devTasks, len, releaseTasks, startTasks, task;

    configFile = grunt.file.read("package.json");
    currentProject = null;
    taskName = "default";
    globalConfig = JSON.parse(configFile);
    process.argv.forEach(function (val, index, array) {
        if (index === 2) {
            let tmp = val.split(":");
            if (tmp.length < 2) {
                taskName = val;
                return;
            } else {
                currentProject = tmp[1];
            }
            taskName = tmp[0];
            if (taskName === "start") {
                if (globalConfig["current"] !== tmp[1]) {
                    globalConfig["current"] = tmp[1];
                    return grunt.file.write("package.json", JSON.stringify(globalConfig, null, 4));
                }
            }
        }
    });

    if (currentProject === null) {
        currentProject = globalConfig["current"];
        if (currentProject === null) {
            console.log("Grunt is error,Corrent command like {grunt start:projectName}");
            process.exit(1);
        }
    }

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks('grunt-webpack');

    sep = path.sep;
    cf = globalConfig['projects'][currentProject];
    if (cf === void 0) {
        devPath = process.cwd() + sep + "apps" + sep + currentProject;
        if (!fs.existsSync(devPath)) {
            console.log("Cant't found the project " + currentProject);
            process.exit(1);
        }
        devPath += sep + "res" + sep;
        if (!fs.existsSync(devPath)) {
            util.initProject(devPath);
        }
        cf = {"dev": devPath};
    } else {
        devPath = path.resolve(cf.dev) + sep;
    }

    grunt.log.writeln(devPath);
    if (devPath === void 0) {
        console.log("dev property is needed for " + currentProject);
        process.exit(1);
    }
    if (cf.release === void 0) {
        relPath = devPath + "build" + sep;
    } else {
        relPath = path.resolve(cf.release) + sep;
    }
    if (!cf.debug) {
        cf.debug = devPath + "debug" + sep;
    }
    debugPath = path.resolve(cf.debug) + sep;
    devWebConfig = getWebpack(devPath, "start");
    webpackConfig = getWebpack(devPath, "build");

    let config = {
        pkg: cf,
        sass: {
            release: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    trace: false
                },
                files: {}
            },
            dev: {
                options: {
                    sourcemap: "auto",
                    style: "compact",
                    debugInfo: false,
                    trace: false
                },
                files: {}
            }
        },
        webpack: {
            prod: webpackConfig,
            dev: devWebConfig
        },
        watch: {
            options: {
                nospawn: true,
                event: ['changed', 'deleted']
            },
            sass: {
                files: [devPath + "sass/*", devPath + "sass/**"]
            },
            vue: {
                files: [devPath + "vue/*", devPath + "vue/**"],
                tasks: ["webpack:dev"],
                options: {
                    spawn: false
                }
            }
        }
    };

    grunt.config.init(config);
    grunt.registerTask("clean", function () {
        let cssDir, jsDir, removeOld;
        removeOld = function (abspath, rootdir, subdir, filename) {
            if (filename.indexOf(".js") === -1 && filename.indexOf(".css") === -1) {
                return;
            }
            return grunt.file["delete"](abspath);
        };
        jsDir = debugPath + "js";
        cssDir = debugPath + "css";
        if (grunt.file.isDir(jsDir)) {
            grunt.file.recurse(jsDir, removeOld);
        }
        if (grunt.file.isDir(cssDir)) {
            return grunt.file.recurse(cssDir, removeOld);
        }
    });

    let compileSass, debugSass, sassMerge, sassSub, sassSubList;
    sassMerge = function (dir) {
        let content, file, files, i, len, name, parentDir, result, sassFile;
        if (!util.isDir(dir)) {
            return;
        }
        files = fs.readdirSync(dir);
        result = [];
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            if (!util.endWith(file, ".scss") || file[0] === "_") {
                continue;
            }
            name = util.baseName(file, "scss");
            if (name === "all") {
                continue;
            }
            result.push(name);
        }
        parentDir = util.dirName(dir);
        content = result.join('";\n@import "');
        sassFile = devPath + "sass/" + parentDir + "/all.scss";
        content = '@import "' + content + '";';
        return grunt.file.write(sassFile, content);
    };

    sassSubList = fs.readdirSync(devPath + "sass");

    for (i = 0, len = sassSubList.length; i < len; i++) {
        sassSub = sassSubList[i];
        if (sassSub.indexOf(".") > -1) {
            continue;
        }
        sassSub = devPath + "sass" + sep + sassSub;
        if (!util.isDir(sassSub)) {
            continue;
        }
        sassMerge(sassSub);
    }

    debugSass = function (isDebug) {
        var file, filename, files, j, len1, outPath, result, sourceFile;
        outPath = relPath;
        if (isDebug) {
            outPath = debugPath;
        }
        sourceFile = devPath + 'sass';
        result = {};
        files = fs.readdirSync(sourceFile);
        for (j = 0, len1 = files.length; j < len1; j++) {
            file = files[j];
            if (!util.endWith(file, ".scss")) {
                continue;
            }
            filename = util.baseName(file, "scss");
            result[outPath + "css" + sep + filename + ".css"] = sourceFile + sep + file;
        }
        return result;
    };

    compileSass = function (file) {
        var basename, dirname, outpath, result, sourceFile;
        dirname = util.dirName(file);
        if (dirname === "sass") {
            basename = util.baseName(file, "scss");
            outpath = debugPath + "css" + sep + basename + ".css";
            sourceFile = devPath + 'sass' + sep + basename + ".scss";
        } else {
            outpath = debugPath + "css" + sep + dirname + ".css";
            sourceFile = devPath + 'sass' + sep + dirname + ".scss";
        }
        result = {};
        result[outpath] = sourceFile;
        grunt.config(["sass", "dev", "files"], result);
        return grunt.task.run("sass:dev");
    };

    grunt.registerTask("scssDebug", function () {
        var files;
        files = debugSass(true);
        grunt.config(["sass", "dev", "files"], files);
        return grunt.task.run("sass:dev");
    });

    grunt.registerTask("scssRelease", function () {
        var files;
        files = debugSass();
        grunt.config(["sass", "release", "files"], files);
        return grunt.task.run("sass:release");
    });

    grunt.event.on('watch', function (action, filepath, target) {
        var dirName, file;
        if (action === "deleted" || action === "added") {
            if (target === "scss") {
                dirName = util.dirName(filepath);
                sassMerge(dirName);
            }
        }
        if (util.endWith(filepath, 'all.scss')) {
            return;
        }
        file = util.baseName(filepath);
        if (file !== void 0 && file[0] === ".") {
            return;
        }
        switch (target) {
            case "js":
                return console.log("js");
            case "sass":
                return compileSass(filepath);
        }
    });

    devTasks = ["scssDebug"];
    startTasks = ["watch"];
    releaseTasks = ["webpack:dev", "webpack:prod", "scssRelease"];
    if (taskName === "build") {
        for (i = 0, len = devTasks.length; i < len; i++) {
            task = devTasks[i];
            releaseTasks.unshift(task);
        }
    }
    grunt.registerTask("clean", "clean");
    grunt.registerTask('default', releaseTasks);
    grunt.registerTask('start', startTasks);
    grunt.registerTask('build', releaseTasks);
};