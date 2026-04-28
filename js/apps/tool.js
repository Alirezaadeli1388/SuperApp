export function renderTool(el){

  el.innerHTML = `
    <h1>Tools</h1>

    <hr>

    <h2>Download from Aparat Music</h2>

    <input id="linkInput" placeholder="Paste Aparat link...">
    <button id="downloadBtn">Get Download Link</button>

    <p id="status"></p>
  `;

  const input = el.querySelector('#linkInput');
  const btn = el.querySelector('#downloadBtn');
  const status = el.querySelector('#status');

  btn.onclick = async () => {
    const url = input.value.trim();

    if(!url){
      status.textContent = "Enter link";
      return;
    }

    status.textContent = "Processing...";

    try{
      const res = await fetch(`http://localhost:3000/get-audio?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if(data.audio){
        status.innerHTML = `
          <a href="${data.audio}" target="_blank">Download Music</a>
        `;
      }else{
        status.textContent = "Audio not found";
      }

    }catch{
      status.textContent = "Server error";
    }
  };
}