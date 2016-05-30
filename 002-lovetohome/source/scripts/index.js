(function() {

    var autiobtn = document.getElementsByClassName('audio')[0];


    var addClass = function(ele, strClass) {
        var reg = new RegExp("(^| )" + strClass + "( |$)");
        if (reg.test(ele.className)) {
            //如果此类样式已经存在，则什么也不需要做
        } else { //不存在
            ele.className = ele.className.trim() + " " + strClass;
        }
    };

    var removeClass = function(ele, strClass) {
        if (!(ele && ele.nodeType == 1)) {
            throw new Error('第一参数ele需要是一个DOM元素对象');
        }
        if (typeof strClass != 'string') {
            throw new Error('第二参数必须为string类型');
        }
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)", "g");
        ele.className = ele.className.replace(reg, '').trim();
    };


    autiobtn.onclick = function() {
        var audio = document.getElementById('media');
        if(audio!==null){
            if(audio.paused){
                audio.play();
                addClass(autiobtn, 'rotate');
            }else{
               audio.pause();
               removeClass(autiobtn, 'rotate');
            }
        }
    }

})();
