/// <reference path="js/jquery-3.2.1.min.js" />
$(document).ready(function () {
	$('#datasend').on('click',sendMessage);
	$('#data').keypress(processEnterPress);
	$('#userBtn').on('click', showChatWall);
	$('#imagefile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(evt){
			socket.emit('userImage', evt.target.result);
		};
		$('#imagefile').val('');
		fileName = file.name;
	});

	$('#otherfile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('otherFile', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#otherfile').val('');
		fileName = file.name;
	});
});

//Client code for socket.io
var socket = io();
var fileName;
socket.on('addimage', sendImage);
socket.on('otherformat', sendFile);
socket.on('updatechat', processMessage);
socket.on('updateusers', updateUserList);
socket.on('sendmsg', printMsg);

function showChatWall(){
	var user = $('#username').val();
	if(!user){
		alert('Enter User Name');
	}else{
		socket.emit('adduser', user);
		$('.chat-wall').css('display','table');
		$('#setUser').css('display', 'none');
	}
}

function printMsg(username, data){
	var html='';
		html = '<p><strong>'+username+' : </strong>';
		html += ' '+data+'</p>';
	$('#conversation').append(html);
}

function sendImage(data, image){
	$('#conversation')
	.append(
		$('<p>').append($('<b>').text(data), '<a class="chatLink" download="'+fileName+'" href="'+ image +'">'+'<img class="send-img" src="'+image+'"/></a>'
		)
	);
}

function sendFile(data, base64file){
	$('#conversation')
	.append(
		$('<p>').append($('<b>').text(data), ' : <a class="Otherfile" download="'+fileName+'" href="'+ base64file +'">'+fileName+'</a>'
		)
	);
}

function processMessage(data) {
	$('#conversation').append('<p>'+data+'</p>');
}

function updateUserList(data) {
	$('#users').empty();
	$.each(data, function (key, value) {
		$('#users').append('<div class="userActive">' + key + '</div>');
	});
}

function sendMessage() {
	var message = $('#data').val();
	$('#data').val('');
	socket.emit('sendchat', message);
	$('#data').focus();
}

function processEnterPress(e) {
	if (e.which == 13) {
		e.preventDefault();
		$(this).blur();
		$('#datasend').focus().click();
	}
}


