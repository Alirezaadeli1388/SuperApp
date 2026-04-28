function calcEval(expr){
  if(!/^[0-9+\-*/(). ]+$/.test(expr)) return 'Error';
  try{return Function('return '+expr)()}catch{return 'Error'}
}

export function renderCalculator(el){
  el.innerHTML = `
    <input id='c'>
    <button id='eq'>=</button>
    <div id='r'></div>
  `;

  const input = el.querySelector('#c');
  const result = el.querySelector('#r');

  el.querySelector('#eq').onclick = ()=>{
    result.innerText = calcEval(input.value);
  };
}