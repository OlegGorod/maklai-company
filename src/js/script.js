const form = document.querySelector(".form__birthdate");
let usersWrapper = document.querySelector(".users__wrapper");
const birthdateFrom = document.getElementById("birthdateFrom");
const birthdateTo = document.getElementById("birthdateTo");
const buttonReload = document.querySelector(".form__reload");

const quantityOfUsers = 18;

function getInputValue(e) {
  e.preventDefault();
  const fromDate = birthdateFrom.value;
  const toDate = birthdateTo.value;
  if (!fromDate) {
    alert("Choose at least the first date");
    return;
  } else if (fromDate > toDate && toDate !== "") {
    alert("The first date should be less than second");
    return;
  }
  renderUsers(fromDate, toDate);
}

function createUserCard(user) {
  const { firstname, lastname, phone, gender, email, birthday, website } = user;
  const card = document.createElement("div");
  card.classList.add("users__card");

  card.innerHTML = `
                <h2>${firstname} ${lastname}</h3>
                <div class="users__card-data">
                    <img src="src/icons/envelope.png" alt="mail" /><a href="mailto:${email}">${email}</a>
                </div>
                <div class="users__card-data">
                    <img src="src/icons/phone-alt.png" alt="phone" /><a href="tel:${phone}">${phone}</a>
                </div>
                <div class="users__card-data">
                    <img src="src/icons/birthday-cake.png" alt="cake" />
                    <div>${birthday}</div>
                </div>
                <div class="users__card-data">
                    <img src="src/icons/${
                      gender === "female" ? "female" : "male"
                    }.png" alt="person" />
                    <div>${gender}</div>
                </div>
                <div class="users__card-data">
                    <img src="src/icons/Vector.png" alt="earth" /><a href="${website}">${website}</a>
                </div>
           `;

  return card;
}
async function fetchDataFromBackend(start, end) {
  try {
    const response = await fetch(
      `https://fakerapi.it/api/v1/persons?_quantity=${quantityOfUsers}&_birthday_start=${start}&_birthday_end=${end}`
    );
    if (!response.ok) {
      throw new Error("An error during fetch data");
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error("Some error", error);
    throw error;
  }
}

function createAndUpdateUsersCard(usersData) {
  usersWrapper.innerHTML = "";
  const sortedUsers = usersData.data.sort(
    (a, b) => new Date(a.birthday) - new Date(b.birthday)
  );
  sortedUsers.forEach((user) => {
    const userCard = createUserCard(user);
    usersWrapper?.appendChild(userCard);
  });
}

function setMaxDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  return tomorrow.toISOString().slice(0, 10);
}

async function renderUsers(start, end) {
  try {
    const usersData = await fetchDataFromBackend(start, end);
    createAndUpdateUsersCard(usersData);
  } catch (error) {
    console.error("Some error happens", error);
    throw error;
  }
}
buttonReload.addEventListener("click", (e) => getInputValue(e));
birthdateFrom.setAttribute("max", setMaxDate());
birthdateTo.setAttribute("max", setMaxDate());
