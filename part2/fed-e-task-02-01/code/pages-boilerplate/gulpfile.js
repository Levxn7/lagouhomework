// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp')
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

const del = require('del')

const browserSync = require('browser-sync')
const bs = browserSync.create()

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}




const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src'})
    .pipe(plugins.sass({ outputstyle: 'expanded'}))//完全展开的形式
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src'})
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
    return src('src/**/*.html', { base: 'src'})
    .pipe(plugins.swig({ data }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('temp'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('temp'))
}

const extra = () => {
    return src('public/**', { base: 'public'})
    .pipe(dest('temp'))
}

const clean = () => {
    return del(['temp'])
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
//   watch('src/assets/images/**', image)
//   watch('src/assets/fonts/**', font)
//   watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'temp/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

const compile = parallel(style, script, page)
// const build = parallel(compile, extra)
const build = series(clean, parallel(series(compile, useref), image, font, extra))

const dev = series(compile, serve)

module.exports = {
    // style,
    // script,
    // page,
    // image,
    // font,
    // compile,
    build,
    // extra,
    clean,
    // serve,
    dev
}
