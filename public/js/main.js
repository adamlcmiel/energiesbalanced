require.config({
	baseUrl: 'js/vendor'
});
require([ 
  "jquery", 
  "underscore", 
  "backbone",  
], function($, _, Backbone) {
$(document).ready(function(){
        var currentUser = null;        
        var Router = Backbone.Router.extend({
                routes:{
                        "/": "checkUser",
                        "sign_in": "loadSignIn",
                        "nav": "loadNav",
                        "logout": "logout"
                },
                checkUser: checkUserAndNavigate('/nav'),
                loadSignIn: function(){
                    $('body *').hide();
                    $('body').append($('#splashPage').html());
                },
            loadNav: function(){
            		navLoggedIn();
                    navView.render();
            },
            logout: function(){
                    currentUser = null;
                    router.navigate('/api/logout');
            }
        });

        var router = new Router();

        function checkUserAndNavigate(){
                $.get('/api/session', function(data){
                        currentUser = data.currentUser;
                        if (currentUser && currentUser.facebook_id){
                                router.navigate('nav', {trigger:true});
                        } else router.navigate('sign_in', {trigger: true});
                });
        };

        function loggedIn(){
                if (!currentUser){
                        router.navigate('/');
                };
        };

        function navLoggedIn(){
        	if(currentUser){
        		router.navigate('/');
        	};
        };

        Backbone.history.start({pushState: true});
});
});