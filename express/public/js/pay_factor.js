$(document).ready(() => 
{
  $('#pay').click(submitPayment);
})

function submitPayment(e)
{
  $('#pay').attr('disabled', 'disabled');
  
  let userid = $('#userid').val();
  let factorid = $('#factorid').val();

  let form = { 'userid': userid, 'factorid': factorid };
  
  $.post('/buyfactor', form, onReturnAnswer);
}

function onReturnAnswer(body)
{
  if(body['status'] == 'fail') {
    alert(body['message']);
    $('#pay').removeAttr('disabled');
  }
  else window.location.replace(body['link']);
}