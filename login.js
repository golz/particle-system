var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mousePosition = new Vector(0, 0);
window.onmousemove = function (e) { 
    mousePosition.setValue(e.clientX, e.clientY);
};

var particleCanvas = new ParticleCanvas(canvas, mousePosition);
particleCanvas.init();
particleCanvas.draw();

var usernameEl = document.querySelector('.usernameInput');
var passwordEl = document.querySelector('#passowrdInput');
var errorMsgEl = document.querySelector('#errorMessage');
var loginBtnEl = document.querySelector('#loginBtn');
var loginFormEl = document.querySelector('#loginForm');

var isProcessing = false;
var flag = false;

loginFormEl.onsubmit = function () {
    if (flag) return true;
    flag = true;
    if (isProcessing) return;
    isProcessing = true;

    var isValid = validate();
    if (!isValid) {
        isProcessing = false;
        return;
    }

    var saltRequest = new XMLHttpRequest();
    saltRequest.onload = function () {
        var response = JSON.parse(saltRequest.response);
        var encPass = EncryptToBase64(response.Salt + usernameEl.value, passwordEl.value);
        document.querySelector('#username').value = usernameEl.value;
        document.querySelector('#password').value = encPass;
        loginFormEl.submit();
    }
    saltRequest.open("GET", "/api/General/Salt?username=" + usernameEl.value);
    saltRequest.send();
    return false;
}

function validate() {
    if ("" == usernameEl.value)
        errorMsgEl.innerHTML = 'Username must be filled';
    else if ("" == passwordEl.value) 
        errorMsgEl.innerHTML = 'Password must be filled';
    else
        return true;

    return false;
}

var timeEl = document.querySelector('form > time');
var currentTime = new Date();
var hour = currentTime.getHours();
var deg = (Math.min(12, Math.max(0, hour - 7)) - 6) / 6 * 45;
document.querySelector('.bg').style.background = 'linear-gradient(' + deg + 'deg, #1e130c, #9a8478)';

tick();

setInterval(function () {
    currentTime.setSeconds(currentTime.getSeconds() + 1);
    tick()
}, 1000);

function getCurrentTime() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        currentTime = new Date(xhr.response);
    }
    xhr.open("GET", "/api/General/Time");
    xhr.send();
}
function tick() {
    var timeStr = currentTime.toTimeString();
    timeEl.innerHTML = timeStr.substr(0, timeStr.indexOf('(') - 1);
}