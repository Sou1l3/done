const API_URL = "https://jsonplaceholder.typicode.com/posts";
let cards = [];
const spinner = document.getElementById("mr_spinner");
function unhidespinner() {
  spinner.classList.remove("d-none");
}
const formy = document.getElementById("adding");
function unhideform() {
  formy.classList.remove("d-none");
}
function hideform() {
  formy.classList.add("d-none");
}
function hidespinner() {
  spinner.classList.add("d-none");
}
function test() {
  alert("hello");
}
let productname = document.getElementById("productnameid");
let priced = document.getElementById("productpriceid");
let describ = document.getElementById("description");
function addar() {
  if (!validateForm()) return;
  let product = {
    name: productname.value,
    price: priced.value,
    describtion: describ.value,
    imge: "/product.webp",
  };
  cards.push(product);
  saveToLocalStorage();
  clearInputs();
  displaydata();
  hideform();
}
function clearInputs() {
  productname.value = "";
  priced.value = "";
  describ.value = "";
}
let cardsContainer = document.getElementById("cards-container");
function displaydata() {
  let cartona = [];
  for (let i = 0; i < cards.length; i++) {
    cartona += `
      <div class="col">
        <div class="card h-100 shadow-sm" onclick="openModal(${i})" style="cursor: pointer;">
        <img src="/product.webp" alt="" height="160px">
          <div class="card-body d-flex flex-column">
            <h2 class="card-title">${cards[i].name}</h2>
            <div class="fw-bold text-primary mt-3">${cards[i].price}</div>
            <p class="card-text text-muted flex-grow-1">
              ${cards[i].describtion}
            </p>
            
          </div>
          <div class="card-footer d-flex text-center justify-content-center gap-3" onclick="event.stopPropagation()">
<button type="button" class="btn btn-danger" onclick="deleteItem(${i})">delete</button>
<button type="button" class="btn btn-warning" onclick="dataedit(${i})">edit</button>
</div>
        </div>
      </div>
   `;
  }
  cardsContainer.innerHTML = cartona;
}
let editindex = null;
const submitbutt = document.getElementById("submitguy");
const editbutt = document.getElementById("edit");
const erroralirname = document.getElementById("errorfaltname");
const erroralirprice = document.getElementById("errorfaltprice");
const erroralirdesc = document.getElementById("errorfaltdescription");

function showerrorname() {
  erroralirname.classList.remove("d-none");
  setTimeout(() => {
    erroralirname.classList.add("d-none");
  }, 4000);
}
function showerrorprice() {
  erroralirprice.classList.remove("d-none");
  setTimeout(() => {
    erroralirprice.classList.add("d-none");
  }, 4000);
}
function showerrordesc() {
  erroralirdesc.classList.remove("d-none");
  setTimeout(() => {
    erroralirdesc.classList.add("d-none");
  }, 4000);
}
async function getPosts() {
  const localData = localStorage.getItem("myproducts");

  if (localData) {
    cards = JSON.parse(localData);
    displaydata();
  } else {
    try {
      unhidespinner();
      let response = await fetch(API_URL);
      let data = await response.json();

      cards = data.slice(0, 8).map((post) => ({
        name: post.title.split(" ").slice(0, 2).join(" "),
        price: Math.floor(Math.random() * 500) + 50,
        describtion: post.body,
      }));
      saveToLocalStorage();
      displaydata();
    } catch (error) {
      document.getElementById("errorfalt").classList.remove("d-none");
      document.getElementById("errorfalt").innerText =
        "ERROR 404 لو مش مصدق براحتك";
    } finally {
      hidespinner();
    }
  }
}
function saveToLocalStorage() {
  localStorage.setItem("myproducts", JSON.stringify(cards));
}
function validateForm() {
  const name = productname.value.trim();
  const price = priced.value.trim();
  const desc = describ.value.trim();
  let tester = true;
  if (!name) {
    showerrorname();
    tester = false;
  }
  if (!price) {
    showerrorprice();
    tester = false;
  }
  if (!desc) {
    showerrordesc();
    tester = false;
  }
  if (!tester) {
    return false;
  }
  if (isNaN(price) || Number(price) <= 0) {
    showerrorprice();
    return false;
  }

  return true;
}
function deleteItem(index) {
  cards.splice(index, 1);
  saveToLocalStorage();
  displaydata();
}
let updatedIndex = null;
function dataedit(index) {
  unhideform();
  updatedIndex = index;
  productname.value = cards[index].name;
  priced.value = cards[index].price;
  describ.value = cards[index].describtion;
  submitbutt.classList.add("d-none");
  editbutt.classList.remove("d-none");
}
editbutt.addEventListener("click", function () {
  if (updatedIndex !== null) {
    cards[updatedIndex] = {
      name: productname.value,
      price: priced.value,
      describtion: describ.value,
    };
    saveToLocalStorage();
    displaydata();
    clearInputs();
    submitbutt.classList.remove("d-none");
    editbutt.classList.add("d-none");
    updatedIndex = null;
    hideform();
  }
});
const mr_search = document.getElementById("searchinput");
function serching() {
  let usableserch = mr_search.value;
  let cartona = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].name.toLowerCase().includes(usableserch.toLowerCase())) {
      cartona += `
      <div class="col">
        <div class="card h-100 shadow-sm" onclick="openModal(${i})" style="cursor: pointer;">
        <img src="/product.webp" alt="" height="160px">
          <div class="card-body d-flex flex-column">
            <h2 class="card-title">${cards[i].name}</h2>
            <div class="fw-bold text-primary mt-3">${cards[i].price}</div>
            <p class="card-text text-muted flex-grow-1">
              ${cards[i].describtion}
            </p>
            
          </div>
          <div class="card-footer d-flex text-center justify-content-center gap-3" onclick="event.stopPropagation()">
<button type="button" class="btn btn-danger" onclick="deleteItem(${i})">delete</button>
<button type="button" class="btn btn-warning" onclick="dataedit(${i})">edit</button>
</div>
        </div>
      </div>
   `;
    }
  }
  cardsContainer.innerHTML = cartona;
}
function openModal(index) {
  let product = cards[index];

  document.getElementById("modalTitle").innerText = product.name;
  document.getElementById("modalPrice").innerText = product.price + " EGP";
  document.getElementById("modalDesc").innerText = product.describtion;

  let myModal = new bootstrap.Modal(document.getElementById("productModal"));
  myModal.show();
}
getPosts();
