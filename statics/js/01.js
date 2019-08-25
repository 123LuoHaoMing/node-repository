window.onload = function () {
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {
                if (els[i].className === cls
                    || els[i].className.indexOf(cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls) >= 0) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    }

    var cartTable = document.getElementById("cartTable");
    var tr = cartTable.children[1].rows;
    var checkInputs = document.getElementsByClassName("check");
    var checkAllInputs = document.getElementsByClassName("check-all");
    var selectedTotal = document.getElementById("selectedTotal");
    var priceTotal = document.getElementById("priceTotal");
    var selected = document.getElementById("selected");
    var foot = document.getElementById("foot");
    var selectedViewList = document.getElementById("selectedViewList");
    var flag = true;

    selected.onclick = function () {
        var showUp = this.getElementsByTagName("span")[1];
        if (selectedTotal.innerHTML != 0 && flag == true) {
            foot.className = 'foot show';
            flag = false;
        } else if (selectedTotal.innerHTML != 0 && flag == false) {
            foot.className = "foot";
            flag = true;
        }
        else {
            foot.className = "foot";
        }
    }

    // 设置两个全选按钮的功能。
    for (var i = 0; i < checkAllInputs.length; i++) {
        checkAllInputs[i].onclick = function () {
            if (this.checked === true) {
                for (var j = 0; j < checkInputs.length; j++) {
                    checkInputs[j].checked = true;
                }
                getTotal();
            } else {
                for (var j = 0; j < checkInputs.length; j++) {
                    checkInputs[j].checked = false;
                }
                getTotal();
            }

        }
    }

    // 设置单选按钮的功能
    for (var k = 0; k < tr.length; k++) {
        tr[k].getElementsByTagName("input")[0].onclick = function () {
            getTotal();

            // 当单选框全为0时，全选框取消
            if (tr[0].getElementsByTagName("input")[0].checked === false &&
                tr[1].getElementsByTagName("input")[0].checked === false &&
                tr[2].getElementsByTagName("input")[0].checked === false &&
                tr[3].getElementsByTagName("input")[0].checked === false) {
                for (var i = 0; i < checkAllInputs.length; i++) {
                    checkAllInputs[i].checked = false;
                }
            }
        }
    }


    // 计算已选商品总数，总价, 图标
    function getTotal() {
        selected = 0;
        price = 0;
        html = "";
        for (var i = 0; i < tr.length; i++) {
            if (tr[i].getElementsByTagName("input")[0].checked === true) {
                selected += parseInt(tr[i].getElementsByTagName("input")[1].value);
                price += parseFloat(tr[i].cells[4].innerHTML);
                html += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">取消选择</span></div>'
            }
            selectedTotal.innerHTML = selected;
            priceTotal.innerHTML = price.toFixed(2);
            selectedViewList.innerHTML = html;
        }
        for (var j = 0; j < tr.length; j++) {
            if (tr[j].getElementsByTagName("input")[0].checked === true) {
                tr[j].style.background = "RGB(238,246,255)"
            } else {
                tr[j].style.background = "#fff"
            }
        }
    }

    // 计算小计
    function getSubTotal(onetr) {
        var tsd = onetr.cells;
        var price = parseFloat(tsd[2].innerHTML);
        var count = parseInt(onetr.getElementsByTagName("input")[1].value)
        var subTotal = parseFloat(price * count);
        tsd[4].innerHTML = subTotal.toFixed(0);
    }


    for (var i = 0; i < tr.length; i++) {
        // 设置'+，-'按钮，和数量kuang
        tr[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var count = this.getElementsByTagName("input")[1];
            var val = parseInt(count.value);
            switch (cls) {
                case "add":
                    count.value = val + 1;
                    this.getElementsByClassName("reduce")[0].innerHTML = "-";
                    getSubTotal(this);
                    break;
                case "reduce":
                    if (val > 1) {
                        count.value = val - 1;
                    }
                    if (count.value <= 1) {
                        this.getElementsByClassName("reduce")[0].innerHTML = "";

                    }
                    getSubTotal(this);
                    break;
                // case "delete":
                //     var conf = confirm('确定要删除吗？');
                //     if (conf) {
                //         this.parentNode.removeChild(this);
                //     }
                //     break;
                default:
                    break;
            }
            getTotal();
        }
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = parseInt(this.value);
            var tr = this.parentNode.parentNode
            var reduce = tr.getElementsByTagName('span')[1];
            if (isNaN(val) || val < 1) {
                val = 1;
            }
            this.value = val;
            if (val <= 1) {
                reduce.innerHTML = '';
            }
            else {
                reduce.innerHTML = '-';
            }
            getSubTotal(tr);
            getTotal();
        }
    }

    // 点击图标的取消选择后，对应的input框也取消选择
    selectedViewList.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == 'del') {
            var index = el.getAttribute('index');
            var input = tr[index].getElementsByTagName('input')[0];
            input.checked = false;
            input.onclick();
        }
    }

    // deleteAll.onclick = function () {
    //     if (selectedTotal.innerHTML != '0') {
    //         var conf = confirm('确定删除吗？');
    //         if (conf) {
    //             for (var i = 0; i < tr.length; i++) {
    //                 var input = tr[i].getElementsByTagName('input')[0];
    //                 if (input.checked) {
    //                     tr[i].parentNode.removeChild(tr[i]);
    //                     i--;
    //                 }
    //             }
    //         }
    //     }
    //     getTotal();
    // }

    checkAllInputs[0].checked = true;
    checkAllInputs[0].onclick();
}