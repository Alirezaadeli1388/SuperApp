export function renderNotes(el){
  el.innerHTML = `
    <div id="noteBar">
      <textarea id='n' placeholder="Write note..."></textarea>
      <button id="addBtn">Add</button>
    </div>

    <div id='l'></div>

    <!-- MODAL -->
    <div id="modal">
      <div id="modalBox">
        <textarea id="editArea"></textarea>

        <div id="modalActions">
          <button id="saveEdit">Save</button>
          <button id="closeEdit">Close</button>
        </div>
      </div>
    </div>
  `;

  const textarea = el.querySelector('#n');
  const list = el.querySelector('#l');

  const modal = el.querySelector('#modal');
  const editArea = el.querySelector('#editArea');

  let editIndex = null;

  function load(){
    const d = JSON.parse(localStorage.notes || '[]');

    list.innerHTML = d.map((x,i)=>
      `<div class="note" data-i="${i}">
        <p>${x}</p>
        <button class="del" data-i="${i}">×</button>
      </div>`
    ).join('');

    // حذف
    list.querySelectorAll('.del').forEach(btn=>{
      btn.onclick = (e)=>{
        e.stopPropagation();
        const d = JSON.parse(localStorage.notes || '[]');
        d.splice(+btn.dataset.i,1);
        localStorage.notes = JSON.stringify(d);
        load();
      }
    });

    // باز کردن ادیت با کلیک روی نوت
    list.querySelectorAll('.note').forEach(note=>{
      note.onclick = ()=>{
        const d = JSON.parse(localStorage.notes || '[]');
        editIndex = +note.dataset.i;

        editArea.value = d[editIndex];
        modal.style.display = "flex";
      }
    });
  }

  // اضافه کردن نوت
  el.querySelector('#addBtn').onclick = ()=>{
    const d = JSON.parse(localStorage.notes || '[]');
    if(textarea.value.trim()){
      d.push(textarea.value);
      localStorage.notes = JSON.stringify(d);
      textarea.value='';
      load();
    }
  };

  // ذخیره ادیت
  el.querySelector('#saveEdit').onclick = ()=>{
    const d = JSON.parse(localStorage.notes || '[]');

    if(editIndex !== null){
      d[editIndex] = editArea.value;
      localStorage.notes = JSON.stringify(d);
    }

    modal.style.display = "none";
    load();
  };

  // بستن
  el.querySelector('#closeEdit').onclick = ()=>{
    modal.style.display = "none";
  };

  load();
}