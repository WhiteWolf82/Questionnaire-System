function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString() + ";";
    var path = "path=/";
    document.cookie = cname + "=" + cvalue + "; " + expires + path;
    // token=username;expires=time;path=/
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function delCookie(cname) {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    var expires = "expires=" + d.toGMTString() + ";";
    var path = "path=/";
    document.cookie = cname + "=" + 'null' + "; " + expires + path;
}

function logout() {
    delCookie('token');
    window.location = "/";
}