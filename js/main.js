let addBtn = $("#add-btn");
let inpName = $("#inp-name");
let inpPrice = $("#inp-price");
let inpSeller = $("#inp-seller");
let inpTelSeller = $("#inp-telSeller");
let imgUrl = $("#img-url");
let list = $(".appended-items");
let editItemId = null;
let pageCount = 1;
let page = 1;
let searchText = "";
render();

$(".search-inp").on("input", function (event) {
  //поиск
  searchText = event.target.value;
  page = 1;
  render();
});
$(".add-new-item").on("click", function () {
  $(".add-item_main_modal").css("display", "block");
  $(".add-item_inner_modal").css("display", "block");
});
addBtn.on("click", function () {
  if (!inpName.val() || !inpPrice.val() || !inpSeller.val() || !imgUrl.val()) {
    alert("Заполните все поля");
    return;
  }
  let newItem = {
    name: inpName.val(),
    price: inpPrice.val(),
    seller: inpSeller.val(),
    imgUrl: imgUrl.val(),
  };
  postNewItem(newItem);
  inpName.val("");
  inpPrice.val("");
  inpSeller.val("");
  imgUrl.val("");
  $(".add-item_inner_modal").css("display", "none");
  $(".add-item_main_modal").css("display", "none");
});
$(".add-item_close").on("click", function () {
  $(".add-item_inner_modal").css("display", "none");
  $(".add-item_main_modal").css("display", "none");
});

function postNewItem(newItem) {
  fetch("http://localhost:8000/items", {
    method: "POST",
    body: JSON.stringify(newItem),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then(() => render());
}
async function render() {
  let res = await fetch(
    `http://localhost:8000/items?_page=${page}&_limit=8&q=${searchText}`
  );
  let data = await res.json();
  console.log(data);
  getPagination();

  list.html("");
  data.forEach((item) => {
    list.append(`<div class="col-md-4 flex-wrap-wrap col-lg-3 pt-5" id="${item.id}">
    <img src="${item.imgUrl}"/><br>
          <h4>${item.name}</h4>
          <span>price: ${item.price}</span> <br>
          <span>seller Name: ${item.seller}</span><br>
          <button type="button" class="btn btn-primary btn-sm btn-edit">edit</button>
          <button type="button" class="btn btn-secondary btn-sm btn-delete">delete</button>
      </div>
      `);
  });
}
$("body").on("click", ".btn-delete", function (event) {
  let id = event.target.parentNode.id;
  fetch(`http://localhost:8000/items/${id}`, {
    method: "DELETE",
  }).then(() => render());
});
$(".btn-close").on("click", function () {
  $(".main-modal").css("display", "none");
});
$("body").on("click", ".btn-edit", function (event) {
  editItemId = event.target.parentNode.id;
  fetch(`http://localhost:8000/items/${editItemId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      $(".edit-inp1").val(data.name);
      $(".edit-inp2").val(data.price);
      $(".edit-inp3").val(data.seller);
      $(".edit-inp4").val(data.imgUrl);
      $(".main-modal").css("display", "block");
    });
});

$(".btn-save").on("click", function (e) {
  let obj = {
    name: $(".edit-inp1").val(),
    price: $(".edit-inp2").val(),
    seller: $(".edit-inp3").val(),
    telSeller: $(".edit-inp4").val(),
    imgUrl: $(".edit-inp5").val(),
  };
  fetch(`http://localhost:8000/items/${editItemId}`, {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    render();
    $(".main-modal").css("display", "none");
  });
});
function getPagination() {
  fetch(`http://localhost:8000/items?&q=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
      pageCount = Math.ceil(data.length / 8);
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
