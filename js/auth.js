export async function hash(str){
  const buf=new TextEncoder().encode(str);
  const hash=await crypto.subtle.digest('SHA-256',buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  login();
});

async function login(){
  const val = document.getElementById('pass').value;
  const h = await hash(val);

  let users = JSON.parse(localStorage.users || "[]");

  // اولین ورود
  if(users.length === 0){
    users.push({
      name: "User",
      pass: h,
      avatar: ""
    });

    localStorage.users = JSON.stringify(users);
    alert("Password Set");
    return;
  }

  const user = users.find(u => u.pass === h);

  if(!user){
    alert("Wrong password");
    return;
  }

  // ذخیره کاربر
  localStorage.currentUser = JSON.stringify(user);

  // 🔥 اینا مهم‌ترین بخشه
  const loginPage = document.getElementById('login');
  const desktop = document.getElementById('desktop');
  const userBox = document.getElementById('userBox');

  loginPage.style.display = 'none';

  // 👇 این خط باعث نمایش اپ‌ها میشه
  desktop.classList.remove('hidden');
  userBox.classList.add('show');
  document.getElementById("dock").classList.add("show");
  document.getElementById('clock').classList.add('move');

  setTimeout(() => {
    desktop.classList.add('show');  // 🔥 افکت نرم
  }, 50);

  // نمایش اطلاعات کاربر
  showUserInfo();
  updateGreeting();
}

// 🔥 load avatar
const users = JSON.parse(localStorage.users || "[]");

if(users.length > 0 && users[0].avatar){
  const img = document.getElementById("loginAvatar");
  const users = JSON.parse(localStorage.users || "[]");

  if(users.length > 0 && users[0].avatar){
    img.src = users[0].avatar;
    img.classList.remove("hidden");
  } else {
    img.classList.add("hidden"); // 🔥 مهم
}
}

const loginName = document.getElementById("loginName");

if(users.length > 0){
  const user = users[0];

  if(user.name){
    loginName.textContent = user.name;
  } else {
    loginName.textContent = "Welcome";
  }
}

function showUserInfo(){
  const user = JSON.parse(localStorage.currentUser || "{}");

  const box = document.getElementById("userBox");

  box.innerHTML = `
    <img src="${user.avatar || ''}">
    <span>${user.name || 'User'}</span>
  `;
}

function updateGreeting(){
  const user = JSON.parse(localStorage.currentUser || "{}");
  const name = user.name || "User";

  const now = new Date();
  const hour = now.getHours();

  let text;

  if(hour >= 5 && hour < 12){
    text = "Good Morning";
  } 
  else if(hour >= 12 && hour < 17){
    text = "Good Afternoon";
  } 
  else if(hour >= 17 && hour < 21){
    text = "Good Evening";
  } 
  else {
    text = "Good Night";
  }

  const el = document.getElementById("greeting");
  if(el){
    el.textContent = `${text} ${name} :)`;
  }
}
