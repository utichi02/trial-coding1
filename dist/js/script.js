"use strict";

jQuery(function ($) {
  // この中であればWordpressでも「$」が使用可能になる
  var topBtn = $('.pagetop');
  topBtn.hide(); // ボタンの表示設定

  $(window).scroll(function () {
    if ($(this).scrollTop() > 70) {
      // 指定px以上のスクロールでボタンを表示
      topBtn.fadeIn();
    } else {
      // 画面が指定pxより上ならボタンを非表示
      topBtn.fadeOut();
    }
  }); // ボタンをクリックしたらスクロールして上に戻る

  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 300, 'swing');
    return false;
  }); //ドロワーメニュー

  $("#MenuButton").click(function () {
    // $(".l-drawer-menu").toggleClass("is-show");
    // $(".p-drawer-menu").toggleClass("is-show");
    $(".js-drawer-open").toggleClass("open");
    $(".drawer-menu").toggleClass("open");
    $("html").toggleClass("is-fixed");
  }); // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動)

  $(document).on('click', 'a[href*="#"]', function () {
    var time = 400;
    var header = $('header').innerHeight();
    var target = $(this.hash);
    if (!target.length) return;
    var targetY = target.offset().top - header;
    $('html,body').animate({
      scrollTop: targetY
    }, time, 'swing');
    return false;
  }); //アコーディオンをクリックした時の動作

  $('.title').on('click', function () {
    //タイトル要素をクリックしたら
    var findElm = $(this).next(".box"); //直後のアコーディオンを行うエリアを取得し

    $(findElm).slideToggle(); //アコーディオンの上下動作

    if ($(this).hasClass('close')) {
      //タイトル要素にクラス名closeがあれば
      $(this).removeClass('close'); //クラス名を除去し
    } else {
      //それ以外は
      $(this).addClass('close'); //クラス名closeを付与
    }
  }); //ページが読み込まれた際にopenクラスをつけ、openがついていたら開く動作※不必要なら下記全て削除

  $(window).on('load', function () {
    $('.p-question__content li:first-of-type section').addClass("open"); //accordion-areaのはじめのliにあるsectionにopenクラスを追加

    $(".open").each(function (index, element) {
      //openクラスを取得
      var Title = $(element).children('.title'); //openクラスの子要素のtitleクラスを取得

      $(Title).addClass('close'); //タイトルにクラス名closeを付与し

      var Box = $(element).children('.box'); //openクラスの子要素boxクラスを取得

      $(Box).slideDown(500); //アコーディオンを開く
    });
  });
});