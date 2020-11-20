const mix = require('laravel-mix');

const paths = {
    js_src: 'src/js/app.js',
    js_dest: 'dist/js',
    scss_src: 'src/scss/app.scss',
    css_dest: 'dist/css',
    fontaweome_src: 'node_modules/@fortawesome/fontawesome-free/webfonts',
    fontawesome_dest: 'src/scss/fontawesome-fonts'
}

mix.js(paths.js_src, paths.js_dest)
    .extract()
    .then(() => {
        console.log('webpack has finished building your scripts!');
    })
    .copy(paths.fontaweome_src, paths.fontawesome_dest)
    .sass(paths.scss_src, paths.css_dest)
    .webpackConfig({
        devtool: 'source-map'
    })
    .then(() => {
        console.log('webpack has finished building your styles!');
    })
    .setPublicPath('dist')
    .disableNotifications()
    .autoload({
        jquery: ['$', 'window.jQuery']
    })