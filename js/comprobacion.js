                   

// function writeCookie(name,value,days) {
//     var date, expires;
//     if (days) {
//         date = new Date();
//         date.setTime(date.getTime()+(days*24*60*60*1000));
//         expires = "; expires=" + date.toGMTString();
//             }else{
//         expires = "";
//     }
//     document.cookie = name + "=" + value + expires + "; path=/";
// }

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

// var sId = '1';
//writeCookie('sessionId', sId, 3);
var sId = readCookie('sesionId');
console.log(sId);

var rol = readCookie('sesionRol');
console.log(rol);

//window.addEventListener('load', function(){

    
    var leer = document.getElementsByClassName("leerc");

    for(let i = 0; i < leer.length; i++) {
        leer[i].addEventListener("click", function() {
            var rol = readCookie('sesionRol');
            console.log(rol);
        })
      }


    var button1 = document.getElementById("bhistorias");

    button1.addEventListener('click', function(){

        if(rol =='Scrum_manager' || rol == 'Developer'){
            location.href="pruebas.html";
            }
        else {
            alert("Inicia sesión");
            }
          

    });

    var button2 = document.getElementById("bmodificar");

    button2.addEventListener('click', function(){

        if(rol =='Scrum_manager'){
            location.href="pruebas.html";
            }
        else {
            alert("No eres Scrum");
            }
          

    });
//});
    