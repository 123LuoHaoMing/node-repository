$(function () {
  $(".header>div").on('click', function() {
    $(".header>div").removeClass("active");
    $(this).addClass('active')
  })
  $('.userLogin').on('click', function() {
    $('.userForm').show();
    $('.adminForm').hide();      
  })
  $('.adminLogin').on('click', function() {
    $('.adminForm').show();
    $('.userForm').hide();  
  })  
})