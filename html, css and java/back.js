let body = document.querySelector('body');

document.querySelector('#red').addEventListener('click', function(){
    body.style.backgroundColor = 'red';
    body.style.width = '115pc';
    body.style.height = '60pc';
})

document.querySelector('#green').addEventListener('click', function(){
    body.style.backgroundColor = 'green';
    body.style.height = '60pc';
})

document.querySelector('#blue').addEventListener('click', function(){
    body.style.backgroundColor = 'blue';
    body.style.height = '60pc';
})