require('./boot');
$(function(){

  var Member = require("models/client/Member");
  $("form").submit(function(e){
    e.preventDefault();
    var newMember = new Member();
    newMember.save({
      email: $("input[name='email']").val(),
      password: $("input[name='password']").val(),
      accessToken: $("input[name='accessToken']").val()
    }).success(function(){
      window.location = "/admin";
    }).error(function(res){
      var body = JSON.parse(res.responseText);
      if(body.result.code === 11000) /// duplicate key
        alert("ALREADY REGISTERED");
      else
        alert(body.result);
    })
    return false;
  })  
})