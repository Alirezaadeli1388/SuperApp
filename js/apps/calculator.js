function calcEval(expr) {
  if (!/^[0-9+\-*/(). ]+$/.test(expr)) return 'Error';
  try { return Function('return ' + expr)() } catch { return 'Error' }
}

export function renderCalculator(el) {
  el.innerHTML = `
  <input id='c' readonly>
  <div id='r'></div>
  <div id="calc_buttons">
      <button data-val="7">7</button>
      <button data-val="8">8</button>
      <button data-val="9">9</button>
      <button data-val="/">÷</button>

      <button data-val="4">4</button>
      <button data-val="5">5</button>
      <button data-val="6">6</button>
      <button data-val="*">×</button>

      <button data-val="1">1</button>
      <button data-val="2">2</button>
      <button data-val="3">3</button>
      <button data-val="-">−</button>

      <button data-val="0">0</button>
      <button data-val=".">.</button>
      <button id="back">⌫</button>
      <button data-val="+">+</button>
      </div>
      
      <button id='eq'>=</button>
  `;

  const input = el.querySelector('#c');
  const result = el.querySelector('#r');

  // دکمه‌های عدد و عملگر
  el.querySelectorAll('#buttons button[data-val]').forEach(btn => {
    btn.onclick = () => {
      input.value += btn.dataset.val;
    };
  });

  // بک اسپیس
  el.querySelector('#back').onclick = () => {
    input.value = input.value.slice(0, -1);
  };

  // مساوی
  el.querySelector('#eq').onclick = () => {
    const res = calcEval(input.value);

    if (res === 'Error') {
      input.value = '';
      result.innerText = 'Error';
    } else {
      input.value = res;
      result.innerText = '';
    }
  };

  // استایل برای گرید
  const style = document.createElement('style');
  style.innerHTML = `

    #calc_buttons{
      display: grid;
      grid-template-columns: repeat(4, 60px);
      gap: 10px;
      margin: 10px 0;
      text_align: center;
      justify-content: center;
      align-items: center;
    }

    #calc_buttons button{
      height: 60px;
      width: 60px;
      font-size: 20px;
      cursor: pointer;
      margin: 0;
    }

    #c {
      width: 210px;
      height: 30px;
      margin-bottom: 10px;
      font-size: 18px;
    }

    #eq {
      width: 60px;
      height: 60px;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('keydown', (e)=>{
  const key = e.key;

  // اعداد و عملگرها
  if(/[0-9+\-*/.()]/.test(key)){
    input.value += key;
  }

  // اینتر = محاسبه
  else if(key === 'Enter'){
    const res = calcEval(input.value);
    input.value = res === 'Error' ? '' : res;
  }

  // بک‌اسپیس
  else if(key === 'Backspace'){
    input.value = input.value.slice(0, -1);
  }

  // پاک کردن کامل
  else if(key === 'Escape'){
    input.value = '';
  }
});
}