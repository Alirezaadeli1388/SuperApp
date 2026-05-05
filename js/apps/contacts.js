export function renderContacts(el) {
  el.innerHTML = `
    <input id='search' placeholder='Search by name or phone'>

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
  const searchInput = el.querySelector('#search');

  const get = () => JSON.parse(localStorage.c || '[]');
  const set = (d) => localStorage.c = JSON.stringify(d);

  let dragIndex = null;

  function render() {
    let data = get();
    const q = searchInput.value.trim().toLowerCase();

    if (q) {
      data = data.filter(x =>
        x.n.toLowerCase().includes(q) ||
        x.p.toLowerCase().includes(q)
      );
    }

    list.innerHTML = data.map((x, i) => `
      <div id='contact' draggable='true' data-i='${i}'>
        <h3>${x.n}</h3>
        <h3>${x.p}</h3>
        <h3>${x.g}</h3>
        <button id='delete' data-i='${i}'>x</button>
      </div>
    `).join('');

    // DELETE
    list.querySelectorAll('#delete').forEach(btn => {
      btn.onclick = () => {
        let data = get();
        data.splice(+btn.dataset.i, 1);
        set(data);
        render();
      };
    });

    enableDrag();
  }

  function enableDrag() {
    const items = list.querySelectorAll('#contact');

    items.forEach(item => {
      item.addEventListener('dragstart', () => {
        dragIndex = +item.dataset.i;
        item.style.opacity = '0.5';
      });

      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();

        const dropIndex = +item.dataset.i;

        if (dragIndex === null || dragIndex === dropIndex) return;

        let data = get();

        const draggedItem = data[dragIndex];

        data.splice(dragIndex, 1);
        data.splice(dropIndex, 0, draggedItem);

        set(data);
        render();
      });
    });
  }

  el.querySelector('#add').onclick = () => {
    let data = get();

    data.push({
      n: el.querySelector('#n1').value,
      p: el.querySelector('#p1').value,
      g: el.querySelector('#g').value
    });

    set(data);

    el.querySelector('#n1').value = '';
    el.querySelector('#p1').value = '';

    render();
  };

  searchInput.oninput = render;

  render();
}