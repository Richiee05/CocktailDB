const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const urlID = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
const input = document.querySelector("#searchTerm");
const form = document.querySelector(".form");
const results = document.querySelector("#results");
const resCon = document.querySelector("#result-con");
const textInfo = document.querySelector(".info");
const textGlass = document.querySelector(".glass");
const textInstructions = document.querySelector(".instructions");
const textCategory = document.querySelector(".category");
const textIngredients = document.querySelector(".ingredients");
const textName = document.querySelector(".text-name");
const headName = document.querySelector(".cocktail-name");
const headImg = document.querySelector(".img");
const loaderGen = document.querySelectorAll("#loader-gen");
const loaderInv = document.querySelector("#loader_individual");
const container = document.querySelector("#display-result-container");

window.addEventListener("load", (e) => {
  e.preventDefault();
  results.innerHTML = "";
  input.focus();
  fetchCocktails(`${url}a`);
});

input.addEventListener("change", (e) => {
  e.preventDefault();
  results.innerHTML = "";
  fetchCocktails(`${url}${input.value}`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value === "" || input.value === null) {
  } else {
    results.innerHTML = "";
    fetchCocktails(`${url}${input.value}`);
  }
});

const loadingInv = () => {
  container.hidden = true;
  loaderInv.hidden = false;
};
const loadingGen = () => {
  results.hidden = true;
  loaderGen.hidden = false;
};
const completeInv = () => {
  container.hidden = false;
  loaderInv.hidden = true;
};
const completeGen = () => {
  results.hidden = false;
  loaderGen.hidden = true;
};

const fetchInvCocktail = async (id) => {
  loadingInv();
  const response = await fetch(`${urlID}${id}`);
  const data = await response.json();
  const { drinks } = data;
  if (drinks) {
    const InvCocktail = drinks.map((item) => {
      const {
        idDrink,
        strDrink,
        strCategory,
        strDrinkThumb,
        strInstructions,
        strAlcoholic,
        strGlass,
        strIngredient1,
        strIngredient2,
        strIngredient3,
        strIngredient4,
        strIngredient5,
        dateModified,
      } = item;
      return {
        id: idDrink,
        name: strDrink,
        category: strCategory,
        img: strDrinkThumb,
        info: strAlcoholic,
        glass: strGlass,
        instructions: strInstructions,
        date: dateModified,
        ingredients: [
          strIngredient1,
          strIngredient2,
          strIngredient3,
          strIngredient4,
          strIngredient5,
        ],
      };
    });
    displayInvCocktail(InvCocktail);
  }
};
const displayInvCocktail = (array) => {
  loadingInv();
  const data = array[0];
  const {
    id,
    name,
    category,
    img,
    info,
    glass,
    date,
    ingredients,
    instructions,
  } = data;
  textInfo.textContent = `${info}`;
  textGlass.textContent = `${glass}`;
  textInstructions.textContent = `${instructions}`;
  textCategory.textContent = `${category}`;
  textIngredients.textContent = `${ingredients}`;
  textName.textContent = `${name}`;
  headName.textContent = `${name}`;
  headImg.setAttribute("src", `${img}`);
  completeInv();
};

const fetchCocktails = async (url) => {
  loadingGen();
  resCon.innerHTML = "";
  const response = await fetch(url);
  const data = await response.json();
  const { drinks } = data;
  if (drinks) {
    const newCocktails = drinks.map((item) => {
      const {
        idDrink,
        strDrink,
        strCategory,
        strDrinkThumb,
        strAlcoholic,
        strGlass,
        strInstructions,
        dateModified,
      } = item;
      return {
        id: idDrink,
        name: strDrink,
        category: strCategory,
        img: strDrinkThumb,
        info: strAlcoholic,
        glass: strGlass,
        date: dateModified,
      };
    });
    results.innerHTML = "";
    completeGen();

    for (const item of newCocktails) {
      const { id, name, category, img, info, glass, date } = item;
      const divCard = results.appendChild(document.createElement("div"));
      divCard.className =
        "bg-white rounded h-fit w-fit relative  shadow-lg hover:shadow-2xl mb-6 drop-shadow-xl hover:drop-shadow-2xl transition-shadow overflow-x-hidden";
      const imgCard = divCard.appendChild(document.createElement("img"));
      img.className = "w-full h-4/6 object-cover";
      imgCard.setAttribute("src", `${img}`);

      const divText = divCard.appendChild(document.createElement("div"));
      divText.className = "ml-6 mt-1 py-7 h-max pr-3 w-fit";

      const divTextH1 = divText.appendChild(document.createElement("h1"));
      divTextH1.className = "font-bold text-6xl";
      divTextH1.textContent = name;

      const divTextH3 = divText.appendChild(document.createElement("h3"));
      divTextH3.textContent = glass;
      divTextH3.className =
        "leading-loose tracking-widest font-bold text-xl mt-3";

      const divTextA = divText.appendChild(document.createElement("a"));
      divTextA.setAttribute("href", "#lightbox");
      divTextA.addEventListener("click", () => {
        fetchInvCocktail(id);
      });
      divTextA.innerHTML = `<button class="border-2 bg-slate-200 hover:bg-slate-400 hover:shadow-sm hover:shadow-slate-800 hover:text-white px-4 rounded-lg py-2 font-thin mt-2">
             DETAILS
           </button>`;
    }
  } else {
    resCon.innerHTML = `<h1 class="capitalize font-mono text-5xl font-extrabold text-red-600">
        There are no cocktails matching your search criteria
      </h1>`;
  }
  completeGen();
};
