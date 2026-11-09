"use strict";

import gulp from "gulp";

const {src, dest, watch} = gulp;

import autoprefixer from "gulp-autoprefixer";
import cssbeautify from "gulp-cssbeautify";
import removeComments from "gulp-strip-css-comments";
import rename from "gulp-rename";
import fileInclude from "gulp-file-include";
import * as sass from "sass";
import gulpSass from "gulp-sass";
const scss = gulpSass(sass);
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import panini from "panini";
import replace from "gulp-replace";
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from "gulp-imagemin";
import {deleteAsync} from "del"; // В новій версії del використовується так
import notify from "gulp-notify";
import browserSyncLib, {stream} from "browser-sync";
const browserSync = browserSyncLib.create();

/* async function clean() {
    return await deleteAsync(path.clean);
}   Приклад функції видалення для нової версії del:*/

/* Paths */

const srcPath = "src/";
const distPath = "dist/"; /* to change all names of folder if u need */

/* Create final folder */

const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        php: distPath,
        images: distPath + "assets/img/",
        fonts: distPath + "assets/fonts/",
        json: distPath + "assets/data/",
        files: distPath + "assets/documents/",
    },
    src: {
        html: srcPath + "assets/pages/**/*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        php: srcPath + "assets/pages/**/*.php",
        images: srcPath + "assets/img/**/*.{jpg,jpeg,png,svg,gif,webp,ico,xml,json,webmanifest}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        json: srcPath + "assets/data/**/*.json",
        files: srcPath + "assets/documents/**/*",
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/scss/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        php: srcPath + "assets/pages/*.php",
        images: srcPath + "assets/img/**/*.{jpg,jpeg,png,svg,gif,webp,ico,xml,json,webmanifest}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        json: srcPath + "assets/data/**/*.json",
        files: srcPath + "assets/documents/**/*",
    },
    clean: "./" + distPath,
};

function server() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath,
        },
    });
}

function html() {
    panini.refresh();
    return src(path.src.html, {base: srcPath + "assets/pages/"})
        .pipe(plumber())
        .pipe(
            panini({
                root: srcPath + "assets/pages/",
                layouts: srcPath + "assets/layouts/",
                partials: srcPath + "assets/partials/",
                data: srcPath + "assets/data/",
            }),
        )
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(
            plumber({
                // Якщо сталася помилка, виводимо сповіщення на екран
                errorHandler: notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %>",
                }),
            }),
        )
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(
            cssnano({
                zindex: false,
                discardComments: {
                    removeAll: true,
                },
            }),
        )
        .pipe(removeComments())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".css",
            }),
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
}

function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(
            plumber({
                // Якщо сталася помилка, виводимо сповіщення на екран
                errorHandler: notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>",
                }),
            }),
        )
        .pipe(
            fileInclude({
                prefix: "//=",
                basepath: "@file",
            }),
        )
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".js",
            }),
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
    return src(path.src.images, {base: srcPath + "assets/img/", encoding: false})
        .pipe(
            imagemin([
                gifsicle({interlaced: true}),
                mozjpeg({quality: 75, progressive: true}),
                optipng({optimizationLevel: 5}),
                svgo({
                    plugins: [
                        {
                            name: "removeViewBox",
                            active: true,
                        },
                        {
                            name: "cleanupIDs",
                            active: false,
                        },
                    ],
                }),
            ]),
        )
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}));
}

function fonts() {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}));
}
function copyJson() {
    return src(path.src.json, {base: srcPath + "assets/data/"}) // Вкажіть шлях до ваших файлів
        .pipe(dest(path.build.json)) // Вкажіть шлях для збереження
        .pipe(browserSync.reload({stream: true}));
}
function php() {
    return src(path.src.php, {base: srcPath + "assets/pages/"})
        .pipe(plumber())
        .pipe(dest(path.build.php))
        .pipe(browserSync.reload({stream: true}));
}
function copyFiles() {
    return src(path.src.files, {base: srcPath + "assets/documents/", encoding: false})
        .pipe(dest(path.build.files))
        .pipe(browserSync.reload({stream: true}));
}

async function clean() {
    return await deleteAsync(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.php], php);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.json], copyJson);
    gulp.watch([path.watch.files], copyFiles);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, php, images, fonts, copyJson, copyFiles));
const dev = gulp.series(build, gulp.parallel(watchFiles, server));

export {html, css, js, images, fonts, clean, build, dev};
export default dev;
