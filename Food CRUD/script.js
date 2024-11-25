// API URL
let api = "https://67175651b910c6a6e0279cb5.mockapi.io/foodItems";

// Fetch food items from the API and display 10 random items
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    displayItems(getRandomSubset(data, 10));

    // Add event listeners to category links
    document.querySelectorAll(".category").forEach((link) => {
      link.addEventListener("click", (x) => {
        x.preventDefault();
        let category = x.target.getAttribute("data-category");
        let filteredData = data.filter((item) => item.category === category);
        document.querySelector(".main .row").innerHTML = "";
        displayItems(filteredData);
        setActiveLink(x.target);
      });
    });

    // Handle form submission for adding/updating food items

    document.getElementById("food-form").addEventListener("submit", (x) => {
      x.preventDefault();

      let formData = new FormData(x.target);
      let newItem = {};
      formData.forEach((value, key) => (newItem[key] = value));
      let foodId = document.getElementById("food-id").value;

      fetch(`${api}${foodId ? "/" + foodId : ""}`, 
      {
        method: foodId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })

      .then((res) => res.json())
      .then(() => location.reload())
      .catch(console.error);
    });

    // document.getElementById("food-form").addEventListener("submit", (x) => {
    //   x.preventDefault();

    //   let newItem = {
    //     title: document.querySelector('input[name="title"]').value,
    //     description: document.querySelector('input[name="description"]').value,
    //     price: document.querySelector('input[name="price"]').value,
    //     image: document.querySelector('input[name="image"]').value,
    //     category: document.querySelector('input[name="category"]').value,
    //   };

    //   let foodId = document.getElementById("food-id").value;
    //   let method = foodId ? "PUT" : "POST";

    //   fetch(`${api}${foodId ? "/" + foodId : ""}`, {
    //     method: method,
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newItem),
    //   })
    //     .then((res) => res.json())
    //     .then(() => {
    //       // Fetch updated data instead of reloading
    //       fetch(api)
    //         .then((response) => response.json())
    //         .then((updatedData) => {
    //           displayItems(getRandomSubset(updatedData, 10));
    //           toggleForm()
    //         })
    //         .catch(console.error);
    //     })
    //     .catch(console.error);
    // });

    // Add event listeners to update button
    document.querySelectorAll(".update-button").forEach((button) => {
      button.addEventListener("click", (x) => {
        let foodId = x.target.getAttribute("data-id");
        let foodItem = data.find((item) => item.id === foodId);
        fillForm(foodItem);
        toggleForm();
      });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", (x) => {
        let foodId = x.target.getAttribute("data-id");
        deleteFoodItem(foodId);
      });
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to get random subset
function getRandomSubset(array, count) {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Function to display items
function displayItems(items) {
  let mainDiv = document.querySelector(".main .row");
  mainDiv.innerHTML = items
    .map(
      (item) => `
    <div class="card">
      <div class="img"><img src="${item.image}" alt="${item.title}"></div>
      <div class="details">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        <div class="edit">
          <h3>₹${item.price}</h3>
          <button class="update-button" data-id="${item.id}">Update</button>
          <button class="delete-button" data-id="${item.id}">Delete</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Function to fill the form for editing
function fillForm(foodItem) {
  document.getElementById("food-id").value = foodItem.id;
  document.querySelector('input[name="title"]').value = foodItem.title;
  document.querySelector('input[name="description"]').value =
    foodItem.description;
  document.querySelector('input[name="price"]').value = foodItem.price;
  document.querySelector('input[name="image"]').value = foodItem.image;
  document.querySelector('input[name="category"]').value = foodItem.category;
}

// Function to delete food item
function deleteFoodItem(foodId) {
  fetch(`${api}/${foodId}`, { method: "DELETE" })
    .then(() => location.reload())
    .catch(console.error);
}

// Toggle form display
document
  .getElementById("add-food-button")
  .addEventListener("click", toggleForm);

// Function to toggle form visibility
function toggleForm() {
  let form = document.getElementById("food-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
}
