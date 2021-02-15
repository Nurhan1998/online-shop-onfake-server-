let list = $(".task-list");
let btn = $(".btn");
let inp1 = $(".task-input1");
let inp2 = $(".task-input2");
let inp3 = $(".task-input3");

let editItemId = null;
let pageCount = 1;
let page = 1;
let searchText = "";
$(".search-inp").on("input", function (event) {
  searchText = event.target.value;
  page = 1;
  render();
});
btn.on("click", function () {
  if (!inp1.val().trim()) {
    alert("Заполните все поля");
    return;
  }
  if (!inp2.val().trim()) {
    alert("Заполните все поля");
    return;
  }
  if (!inp3.val().trim()) {
    alert("Заполните все поля");
    return;
  }
  let newContact = {
    name: inp1.val(),
    surname: inp2.val(),
    phone: inp3.val(),
  };
  postNewCont(newContact);
  inp1.val("");
  inp2.val("");
  inp3.val("");
});

function postNewCont(newContact) {
  fetch("http://localhost:8000/contacts", {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then(() => render());
}

async function render() {
  let res = await fetch(
    `http://localhost:8000/contacts?_page=${page}&_limit=2&q=${searchText}`
  );
  let data = await res.json();
  list.html("");
  getPagination();
  data.forEach((item) => {
    list.append(`<ul id="${item.id}">
            ${item.name} ${item.surname} ${item.phone}
        <button class="btn-delete">Delete</button>
        <button class="btn-edit">Edit</button>    
        </ul>
        `);
  });
}
$("body").on("click", ".btn-delete", function (event) {
  let id = event.target.parentNode.id;
  fetch(`http://localhost:8000/contacts/${id}`, {
    method: "DELETE",
  }).then(() => render());
});

$("body").on("click", ".btn-edit", function (event) {
  editItemId = event.target.parentNode.id;
  fetch(`http://localhost:8000/contacts/${editItemId}`)
    .then((res) => res.json())
    .then((data) => {
      $(".edit-inp1").val(data.name);
      $(".edit-inp2").val(data.surname);
      $(".edit-inp3").val(data.phone);
      $(".main-modal").css("display", "block");
    });
});

$(".btn-save").on("click", function (e) {
  let obj = {
    name: $(".edit-inp1").val(),
    surname: $(".edit-inp2").val(),
    phone: $(".edit-inp3").val(),
  };
  fetch(`http://localhost:8000/contacts/${editItemId}`, {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    render();
    $(".main-modal").css("display", "none");
  });
});
$(".btn-close").on("click", function () {
  $(".main-modal").css("display", "none");
});
function getPagination() {
  fetch(`http://localhost:8000/contacts?&q=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
      pageCount = Math.ceil(data.length / 6);
      $(".pagination-page").remove();
      for (let i = pageCount; i >= 1; i--) {
        $(".prev-btn").after(`
                <span class="pagination-page">
                <a href="#">${i}</a>
                </span>
                `);
      }
    });
}
$(".next-btn").on("click", function () {
  if (page >= pageCount) {
    return;
  }
  page++;
  render();
});
$(".prev-btn").on("click", function () {
  if (page <= 1) {
    return;
  }
  page--;
  render();
});
$("body").on("click", ".pagination-page", function (e) {
  page = e.target.innerText;
  render();
});
render();
