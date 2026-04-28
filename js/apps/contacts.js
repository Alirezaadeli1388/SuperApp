export function renderContacts(el) {
  let c = JSON.parse(localStorage.c || '[]');

  el.innerHTML = `
    <input id='n1' placeholder='Name'>
    <input id='p1' placeholder='Phone Number'>
    <select id='g'>
      <option>Male</option>
      <option>Female</option>
    </select>
    <button id='add'>Add</button>
    <div id='cl'></div>
  `;

  const list = el.querySelector('#cl');

  function render() {
    let c = JSON.parse(localStorage.c || '[]');
    list.innerHTML = c.map((x, i) =>
      `<div id='contact'>
        <h3>${x.n}</h3>
        <h3>${x.p}</h3>
        <h3>${x.g}</h3>
        <button data-i="${i}">x</button>
      </div>`
    ).join('');

    list.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        let c = JSON.parse(localStorage.c);
        c.splice(+btn.dataset.i, 1);
        localStorage.c = JSON.stringify(c);
        render();
      }
    });
  }

  el.querySelector('#add').onclick = () => {
    let c = JSON.parse(localStorage.c || '[]');
    c.push({
      n: el.querySelector('#n1').value,
      p: el.querySelector('#p1').value,
      g: el.querySelector('#g').value
    });
    localStorage.c = JSON.stringify(c);
    render();
  };

  render();
}