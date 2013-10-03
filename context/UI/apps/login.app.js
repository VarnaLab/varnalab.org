require("./boot");

$(function(){

  var Member = require("models/client/Member");

  $('form').submit(function(e){
    e.preventDefault();
    

    var newMember = new Member();
    newMember.login({
      email: $("input[name='email']").val(),
      password: $("input[name='password']").val()
    }).success(function(res){

        window.location = '/admin';

    }).error(function(res){
      var body = JSON.parse(res.responseText);
      alert(body.result.message);
    });

    return false;
  })


})