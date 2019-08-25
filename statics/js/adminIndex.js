window.onload = function () {
  var cHeight =document.documentElement.clientHeight;

  var headHeight = document.getElementsByClassName("header")[0].offsetHeight;
  // console.log(cHeight);
  // console.log(headHeight);
  
  var lineHeight = cHeight- headHeight;
  document.getElementById('lLine').style.height = lineHeight - 1 + 'px';
  document.getElementById('rLine').style.height = lineHeight - 1 + 'px';
}