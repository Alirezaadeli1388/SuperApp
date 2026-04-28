let db;
let dragId = null;
const musicChannel = new BroadcastChannel('music-sync');

// ===================== SYNC BETWEEN TABS =====================
musicChannel.onmessage = (event) => {
  if(event.data === 'reload'){
    loadMusic();
  }
};

// ===================== OPEN DB =====================
const req = indexedDB.open('db', 2);

req.onupgradeneeded = e => {
  db = e.target.result;

  if (!db.objectStoreNames.contains('m')) {
    db.createObjectStore('m', { keyPath: 'id' });
  }
};

req.onsuccess = e => {
  db = e.target.result;
  loadMusic();
};

// ===================== ADD MUSIC (MULTI FILE SAFE) =====================
function addMusic(){
  if(!db) return;

  const input = document.getElementById('f');
  const files = input.files;

  if(!files || files.length === 0){
    alert('Select files');
    return;
  }

  let loaded = 0;

  for(let file of files){

    const reader = new FileReader();

    reader.onload = () => {

      const tx = db.transaction('m','readwrite');
      const store = tx.objectStore('m');

      store.add({
        id: crypto.randomUUID(),
        name: file.name,
        data: new Blob([reader.result], { type: file.type }),
        order: Date.now() + Math.random()
      });

      tx.oncomplete = () => {
        loaded++;

        if(loaded === files.length){
          input.value = '';
          loadMusic();
          musicChannel.postMessage('reload');
        }
      };
    };

    reader.readAsArrayBuffer(file);
  }
}

// ===================== LOAD MUSIC =====================
function loadMusic(){
  if(!db) return;

  const list = document.getElementById('pl');
  const audio = document.getElementById('p');

  if(!list || !audio) return;

  const tx = db.transaction('m','readonly');
  const store = tx.objectStore('m');
  const req = store.getAll();

  req.onsuccess = () => {

    const sorted = req.result.sort((a,b) => a.order - b.order);

    list.innerHTML = '';

    sorted.forEach((item) => {
      if(!item) return;

      const li = document.createElement('li');

      li.innerHTML = `
        <H4>${item.name}</H4>
        <button class="delBtn">x</button>
      `;

      // ================= PLAY =================
      li.onclick = () => {
        const url = URL.createObjectURL(item.data);
        audio.src = url;
        audio.play();
      };

      // ================= DELETE =================
      li.querySelector('.delBtn').onclick = (e) => {
        e.stopPropagation();
        deleteMusic(item.id);
      };

      // ================= DRAG =================
      li.draggable = true;

      li.addEventListener('dragstart', () => {
        dragId = item.id;
        li.style.opacity = "0.5";
      });

      li.addEventListener('dragend', () => {
        li.style.opacity = "1";
      });

      li.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      li.addEventListener('drop', (e) => {
        e.preventDefault();
        reorderMusic(dragId, item.id);
      });

      list.appendChild(li);
    });
  };
}

// ===================== DELETE MUSIC =====================
function deleteMusic(id){
  if(!db) return;

  const tx = db.transaction('m','readwrite');
  const store = tx.objectStore('m');

  store.delete(id);

  tx.oncomplete = () => {
    loadMusic();
    musicChannel.postMessage('reload');
  };
}

// ===================== REORDER =====================
function reorderMusic(fromId, toId){
  if(!db || fromId === toId) return;

  const tx = db.transaction('m','readwrite');
  const store = tx.objectStore('m');
  const req = store.getAll();

  req.onsuccess = () => {
    const data = req.result;

    const fromItem = data.find(i => i.id === fromId);
    const toItem = data.find(i => i.id === toId);

    if(!fromItem || !toItem) return;

    const temp = fromItem.order;
    fromItem.order = toItem.order;
    toItem.order = temp;

    const tx2 = db.transaction('m','readwrite');
    const store2 = tx2.objectStore('m');

    store2.put(fromItem);
    store2.put(toItem);

    tx2.oncomplete = () => {
      loadMusic();
      musicChannel.postMessage('reload');
    };
  };
}

// ===================== EXPORT =====================
export function renderMusic(el){
  el.innerHTML = `
    <input type='file' id='f' multiple>
    <button id='add'>Add</button>
    <ul id='pl'></ul>
    <audio id='p' controls></audio>
  `;

  el.querySelector('#add').onclick = addMusic;
  loadMusic();
}