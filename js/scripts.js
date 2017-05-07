$(document).on('click','.navbar-collapse.in',function(e) {
	if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
		$(this).collapse('hide');
	}
});

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v2.8";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var submitted = false;

var hideFormAndshowMessage = function() {
  $('#gform *').fadeOut(0);
  $('#gform').prepend("<div class=\"alert alert-success\"> <strong>Wiadomość wysłana!</strong> Skontaktujemy się z Tobą jak najszybciej </div>");
}; 
  
