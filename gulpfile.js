const gulp = require("gulp");
const sass = require('gulp-sass');
const bs = require("browser-sync").create();
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const htmlbeautify = require("gulp-html-beautify");

const srcPath = {
  css: 'src/sass/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/images/**/*',
  html: './**/*.html',
  php: './**/*.php',
}

const destPath = {
  css: 'assets/css/',
  js: 'assets/js/',
  img: 'assets/images/'
}

const browsers = [
  'last 2 versions',
  '> 5%',
  'ie = 11',
  'not ie <= 10',
  'ios >= 8',
  'and_chr >= 5',
  'Android >= 5',
]

const browserSyncOption = {
  server: "./"
}

const cssSass = () => {
  return src(srcPath.css)
      .pipe(sourcemaps.init())
      .pipe(
          plumber({
              errorHandler: notify.onError('Error:<%= error.message %>')
          }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
      .pipe(postcss([cssnext(browsers)]))
      .pipe(dest(destPath.css))
      .pipe(notify({
          message: 'Sassをコンパイルしました！',
          onLast: true
      }))
}


gulp.task("bs-init", function () {
  bs.init({
    server: {
      baseDir: "./dist",
    },
    reloadDelay: 1000,//リロードの遅延
    open: false, //起動時のライブリロードを止める
  });
});

// ファイルの監視
gulp.task("watch", function () {
  gulp.watch(["src/ejs/**/*.ejs"], gulp.task("ejs")); //追加
});

gulp.task("ejs", function (done) {
  return gulp
    .src(["src/ejs/**/*.ejs", "!" + "src/ejs/**/_*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(
      htmlbeautify({
        indent_size: 2, //インデントサイズ
        indent_char: " ", // インデントに使う文字列はスペース1こ
        max_preserve_newlines: 0, // 許容する連続改行数
        preserve_newlines: false, //コンパイル前のコードの改行
        indent_inner_html: false, //head,bodyをインデント
        extra_liners: [], // 終了タグの前に改行を入れるタグ。配列で指定。head,body,htmlにはデフォで改行を入れたくない場合は[]。
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("dist/"))
    .pipe(bs.stream());//追加
  done();
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("ejs"), gulp.parallel("watch", "bs-init"))
);



const jsBabel = () => {
  return src(srcPath.js)
      .pipe(
          plumber(
              {
                  errorHandler: notify.onError('Error: <%= error.message %>')
              }
          )
      )
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(dest(destPath.js))
      .pipe(uglify())
      .pipe(
          rename(
              { extname: '.min.js' }
          )
      )
      .pipe(dest(destPath.js))
}
