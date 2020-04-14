var $ = require('jquery');

$(function(){
	$("#toolboxContainer").load("toolbox.html");
});
$(function(){
	$("#modalcontainer").load("networkmodal.html").hide();
});
$(function(){
	$("#configModal").load("configmodal.html").hide();
});
$(function(){
	$("#errorPopup").load("errormodal.html").hide();
});
function openForm() {
	document.getElementById("networkConfig").style.display = "block";
}
function closeForm() {
	document.getElementById("networkConfig").style.display = "none";
}

function openErrorPopup() {
	document.getElementById("errorPopup").style.display = "block";
}
function closeErrorPopup() {
	document.getElementById("errorPopup").style.display = "none";
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('openConfigBtn')
		.addEventListener('click', openForm);
});
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('closeConfigBtn')
		.addEventListener('click', closeForm);
});
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('startConfigBtn')
		.addEventListener('click', demoNodeNum);
});


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('openError')
		.addEventListener('click', openErrorPopup);
});
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('closeError')
		.addEventListener('click', closeErrorPopup);
});