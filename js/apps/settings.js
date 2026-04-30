export function renderSettings(el) {

  el.innerHTML = `
    <h1>Settings</h1>
    <hr>

    <h2>User Profile</h2>
    <input type="text" id="userName" placeholder="Your Name">
    <input type="file" id="avatarUpload" accept="image/*">
    <button id="saveProfile">Save Profile</button>

    <hr>

    <h2>Change Password</h2>
    <input type="password" id="oldPass" placeholder="Old Password">
    <input type="password" id="newPass" placeholder="New Password">
    <button id="changePass">Update Password</button>

    <hr>

    <h2>Change Background</h2>
    <input type="file" id="bgUpload" accept="image/*">
  `;

  // 🔐 تغییر پسورد
  el.querySelector('#changePass').onclick = async () => {
    const oldP = el.querySelector('#oldPass').value;
    const newP = el.querySelector('#newPass').value;

    let users = JSON.parse(localStorage.users || "[]");

    if (users.length === 0) {
      alert("No user found");
      return;
    }

    const hashOld = await hash(oldP);

    // کاربر فعلی (یا اولین کاربر)
    const userIndex = 0; // یا currentUser واقعی اگر داری
    const user = users[userIndex];

    if (hashOld !== user.pass) {
      alert("Wrong old password");
      return;
    }

    // آپدیت پسورد
    user.pass = await hash(newP);
    users[userIndex] = user;

    localStorage.users = JSON.stringify(users);

    // اگر currentUser هم داری آپدیت کن
    localStorage.currentUser = JSON.stringify(user);

    alert("Password updated");
  };

  el.querySelector('#bgUpload').onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;

      document.body.style.backgroundImage = `url(${base64})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";

      localStorage.setItem("bgImage", base64);
    };

    reader.readAsDataURL(file);
  };

  // 🔹 profile save
  el.querySelector('#saveProfile').onclick = () => {
    const name = el.querySelector('#userName').value;
    const file = el.querySelector('#avatarUpload').files[0];

    if (!file) {
      alert("Select image");
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      let users = JSON.parse(localStorage.users || "[]");
      let current = JSON.parse(localStorage.currentUser || "{}");

      const index = users.findIndex(u => u.pass === current.pass);

      users[index].name = name;
      users[index].avatar = reader.result;

      localStorage.users = JSON.stringify(users);
      localStorage.currentUser = JSON.stringify(users[index]);

      alert("Saved");
    };

    reader.readAsDataURL(file);
  };
}

// ⚠️ hash رو باید از auth import کنیم
import { hash } from "../auth.js";