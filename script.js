const addRecipeBtn = document.getElementById('add_recipe_btn');
const addRecipeModal = document.getElementById('add_recipe_modal');
const addRecipeForm = document.getElementById('add_recipe_form');
const addRecipeModalCancelBtn = document.getElementById('add_recipe_modal_cancel_btn');
const searchBar = document.getElementById('search_bar');
const searchBtn = document.getElementById('search_button');
const dataBase = JSON.parse(localStorage.getItem('dataBase')) || [];
const searchResultsConatiner = document.getElementById('search_results_container');
const clickedRecipeModal = document.getElementById('clicked_recipe_modal');
console.log(dataBase);

/* SEARCH BAR */
searchBtn.addEventListener('click', handleSearchQuery);
searchResultsConatiner.addEventListener('click', handleResultClick);

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
    recipeData.id = dataBase.length + 1;
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
        const regex = new RegExp(`(${query})`, 'gi');
        const highLightedName = recipe['recipe-name'].replace(regex, `<span class='highlighted'>$1</span>`);
        const highLightedIngredients = recipe['recipe-ingredients'].replace(regex, `<span class='highlighted'>$1</span>`);
        searchResultsConatiner.innerHTML += `
        <button class="recipe_wrapper" data-id="${recipe.id}">
            <article>
                <h2 class="recipe_title">${highLightedName}</h2>
                <p>${highLightedIngredients}</p>
            </article>
        </button>`;
    });
}

function handleResultClick(e) {
    const clickedResult = e.target.closest('.recipe_wrapper');
    if(!clickedResult) return;

    const recipeId = Number(clickedResult.dataset.id);
    const selectedRecipe = dataBase.find(recipe => recipe.id === recipeId);

    clickedRecipeModal.showModal();
}