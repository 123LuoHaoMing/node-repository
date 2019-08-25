$(function() {
  var inputList = document.getElementsByTagName('input');
  inputList[0].onkeyup = function() {
    var username = this.value;
    if (username) {
      $.get('http://localhost:3000/client/registerAjax', {"username": username}, function(res) {
        inputList[0].nextSibling.innerHTML = res;
      })
    } else {
      inputList[0].nextSibling.innerHTML = "";
    }
    
  }
  inputList[1].onkeyup = function() {
    if (this.value) {
      inputList[1].nextSibling.innerHTML = "OK！";
    } else {
      inputList[1].nextSibling.innerHTML = "";      
    }
  }
});