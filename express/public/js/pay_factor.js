$(document).ready(() => 
{
  $('#pay').click(submitPayment);
  $('#detail').hide();
})

function submitPayment(e)
{
  $('#pay').attr('disabled', 'disabled');
  
  let userid = $('#userid').val();
  let factorid = $('#factorid').val();

  let form = { 'userid': userid, 'factorid': factorid };
  
  $.post('/getDetail', form, onGetDetail);
}

function onGetDetail(body)
{
  console.log(body);
  if(body['status'] == 'fail') {
    showError(body);
    $('#pay').removeAttr('disabled');
  }
  else {
    //window.location.replace(body['link']);
    showFactor(body['factor'], body['getways']);
    $('#inputs').hide();
  }
}

function showFactor(factor, getways)
{
  // setup factor
  let factorDetail = `<h3>فاکتور شماره ${factor.number}</h3>`;
  factorDetail += `<ul>`;
  factor.products.forEach((product) => 
  {
    factorDetail += `<li>${product.name} - ${product.price} تومان</li>`;
  });
  factorDetail += `</ul>`;
  factorDetail += `<h4>قیمت نهایی: ${factor.amount}</h4>`;

  $('#factor').append(factorDetail);

  // setup pay buttons
  getways.forEach(getway => {
    addPayButton(getway.lable, getway.name, factor)
  });

  $('#detail').show();
}

function addPayButton(lable, name, factor)
{
  let form = { 'getway': name, 'factorid': factor.number };
  $.post('/getPaylink', form, (result) => 
  {
    if(result['status'] == 'fail') showError(result);

    else if(result.link) {
      console.log(result);
      let button = `<a href="${result.link}"><button id="${name}" class="w3-button w3-round-large w3-border w3-red w3-block">پرداخت با ${lable}</button></a>`;
      $('#payButtons').append(button);
    }
  });
}

function showError(body)
{
  alert(body);
}