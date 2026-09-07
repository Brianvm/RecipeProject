const addRecipeBtn = document.getElementById('add_recipe_btn');
const addRecipeModal = document.getElementById('add_recipe_modal');
const addRecipeForm = document.getElementById('add_recipe_form');
const addRecipeModalCancelBtn = document.getElementById('add_recipe_modal_cancel_btn');
const searchBar = document.getElementById('search_bar');
const searchBtn = document.getElementById('search_button');
const dataBase = JSON.parse(localStorage.getItem('dataBase')) || [];
const searchResultsConatiner = document.getElementById('search_results_container');
console.log(dataBase);

/* SEARCH BAR */
searchBtn.addEventListener('click', handleSearchQuery);


/* ADD RECIPE MODAL */
addRecipeBtn.addEventListener('click', handleAddRecipeModal);
addRecipeForm.addEventListener('submit', handleAddRecipeFormDataSubmit);
addRecipeModalCancelBtn.addEventListener('click', handleAddRecipeModalCancelBtn);


/* FUNCTIONS */
function handleAddRecipeModal() {
    addRecipeModal.showModal() 
}

function handleAddRecipeModalCancelBtn() {
    addRecipeModal.close();
}

function handleAddRecipeFormDataSubmit(e) {
    e.preventDefault();

    const formData = new FormData(addRecipeForm);
    const recipeData = Object.fromEntries(formData);
    dataBase.push(recipeData);
    localStorage.setItem('dataBase', JSON.stringify(dataBase));
    addRecipeForm.reset();
    addRecipeModal.close();
}

function handleSearchQuery() {
    const query = searchBar.value.toLowerCase();
    searchResultsConatiner.classList.remove('hidden');

    const matchingRecipes = dataBase.filter(recipe => recipe['recipe-name'].toLowerCase().includes(query) || recipe['recipe-ingredients'].toLowerCase().includes(query))

    searchBar.value = '';
    searchResultsConatiner.innerHTML = '';
    matchingRecipes.forEach(recipe => {
        searchResultsConatiner.innerHTML += `
        <article class="recipe_wrapper">
            <h2 class="recipe_title">${recipe['recipe-name']}</h2>
            <p>${recipe['recipe-ingredients']}</p>
        </article>`;
    });
}
