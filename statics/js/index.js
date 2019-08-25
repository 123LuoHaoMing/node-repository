window.onload = function () {

  document.body.style.width = document.body.clientWidth + "px";
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var bannerImgs = $(".banner>.sub-banner");
  var index = 0;

  $(".banner").mouseenter(function () {
    $(".banner span").fadeIn(200);
    clearInterval(time);
  }).mouseleave(function () {
    $(".banner span").fadeOut(200);
    time = setInterval(startBanner, 3000)
  })


  $(prev).click(function () {
    index--;
    if (index < 0) {
      index = 3;
    }
    $(".banner>.sub-banner").fadeOut(500);
    $(".banner>.sub-banner:eq(" + index + ")").fadeIn(500)
  });
  $(next).click(function () {
    startBanner();
  });

  var time = null;
  time = setInterval(startBanner, 3000)

  function startBanner() {
    index++;
    if (index >= 4) {
      index = 0;
    }
    $(".banner>.sub-banner").fadeOut(500);
    $(".banner>.sub-banner:eq(" + index + ")").fadeIn(500);
  }

  $('.product').mouseenter(function () {
    $(this).css({ "backgroundColor": '#ccc', "border": "1px solid red" });
    var that = this;
    startchange(this.children[0], { top: 15 }, function () {
      $(that.children[1]).fadeIn(300);
    })
  }).mouseleave(function () {
    $(this).css({ "backgroundColor": '#eee', "border": "none" });
    $(this.children[1]).hide();
    startchange(this.children[0], { top: 40 })
  })

  console.log(document.cookie)

  // $("#shopNum").html(document.cookie.shopNum);

  // var num = 0;
  // $(".product-buy").click(function() {
  //   num ++;
  //   $("#shopNum").html(num);
  //   $("#shopNum").css("display","block");
  // })

  // $("#zhuxiao").click(function () {
  //   var flag = confirm("确定注销吗？");
  //   if (flag) {

  //   }else {
  //     return false;
  //   }
  // })



  // 轮播图上的nav
  $(".main-nav>li").mouseenter(function () {
    $(this).css("background", "#fff")


    var ind = $(this).index();
    $(".sub-nav>li:eq(" + ind + ")").show().siblings().hide();

    $(".main-nav").css("border-radius", "10px 0 0 10px");
    $(".main-nav>li>div:eq(" + ind + ")").css("border-bottom", "none");
    $(".main-nav>li>div:eq(3)").css("border-bottom", "none");
  }).mouseleave(function () {
    $(this).css("background", "rgb(222, 222, 222)")

    var ind = $(this).index();
    $(".sub-nav>li").hide();
    $(".main-nav").css("border-radius", "10px 10px 10px 10px");
    $(".main-nav>li>div:eq(" + ind + ")").css("border-bottom", "1px #ccc solid");
    $(".main-nav>li>div:eq(3)").css("border-bottom", "none");
  })


  $(".sub-nav>li").mouseenter(function () {
    var ind = $(this).index();
    $(this).show()

    $(".main-nav").css("border-radius", "10px 0 0 10px");
    $(".main-nav>li>div:eq(" + ind + ")").css("border-bottom", "none");
    $(".main-nav>li>div:eq(3)").css("border-bottom", "none");
    $(".main-nav>li:eq(" + ind + ")").css("background", "#fff")
  }).mouseleave(function () {
    var ind = $(this).index();
    $(this).hide()

    $(".main-nav").css("border-radius", "10px");
    $(".main-nav>li:eq(" + ind + ")").css("background", "rgb(222, 222, 222)")
    $(".main-nav>li>div:eq(" + ind + ")").css("border-bottom", "1px #ccc solid");
    $(".main-nav>li>div:eq(3)").css("border-bottom", "none");
  })
}

// $(".product-buy>span").click(function () {
//   $.ajax({
//     url: '/client/addToCart',
//     dataType: 'jsonp',
//     jsonp: 'cb',
//     data: {
//       id: '<%= data[i].id %>'
//     },
//     success: function (result) {
//       console.log(result);
//     },
//     error: function (err) { console.log(result); }
//   });
// });