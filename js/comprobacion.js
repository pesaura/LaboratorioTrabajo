                   

function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

var sId = '1';
writeCookie('sessionId', sId, 3);

var sId = readCookie('sessionId')


window.addEventListener('load', function(){

    var button1 = document.getElementById("bhistorias");

    button1.addEventListener('click', function(){

        if(sId =='1'){
            location.href ="registro.html";
            }
        else {
            location.href="prueba.html";
            }
          

    });

    var button2 = document.getElementById("bmodificar");

    button2.addEventListener('click', function(){

        if(sId =='1'){
            location.href ="registro.html";
            }
        else if(sId =='1'){
            location.href ="registro.html";
            }
        else {
            location.href="prueba.html";
            }
          

    });
});
    