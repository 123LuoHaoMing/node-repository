
    function startchange(obj,json,fn){
        
        clearInterval(obj.timer);
        
        obj.timer=setInterval(function(){
            var flag=true;
            for(var attr in json)
            {
                //取值
                var cur=0;
                if(attr=='opacity'){
                    cur=Math.round((getStyle(obj,attr))*100);
                }
                else{
                    cur=parseInt(getStyle(obj,attr));
                }
                
                //算速度，实现缓冲效果
                var speed=(json[attr]-cur)/8;
                speed=speed>0?Math.ceil(speed):Math.floor(speed);
                ///检测停止
                if(cur!=json[attr]){
                    flag=false;
                }
                //改变样式
            
                if(attr=='opacity'){
                    obj.style.filter='alpha(opacity:'+ (cur+speed)+')';
                    obj.style.opacity=(cur+speed)/100;
                }
                else{
                    obj.style[attr]=cur+speed+"px";
                }
            
                if(flag){
                    clearInterval(obj.timer);
                    if(fn){
                        fn();
                    }
                }
            }
        },30)       
    }
    function getStyle(obj,attr){
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }else{
            return getComputedStyle(obj,false)[attr];
        }
    }
