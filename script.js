const addRecipeBtn = document.getElementById('add_recipe_btn');
const addRecipeModal = document.getElementById('add_recipe_modal');
const addRecipeForm = document.getElementById('add_recipe_form');
const addRecipeModalCloseBtn = document.getElementById('add_recipe_modal_close_btn');
const searchBar = document.getElementById('search_bar');
const searchBtn = document.getElementById('search_button');
const searchResultsContainer = document.getElementById('search_results_container');
const clickedRecipeModal = document.getElementById('clicked_recipe_modal');
const mainHeader = document.querySelector('.handwriting-header');
const main = document.querySelector('main');
const dataBase = JSON.parse(localStorage.getItem('dataBase')) || [];

/* ADD RECIPE MODAL */
addRecipeBtn.addEventListener('click', handleAddRecipeModal);
addRecipeForm.addEventListener('submit', handleAddRecipeFormDataSubmit);
addRecipeModalCloseBtn.addEventListener('click', handleCloseBtn);

/* SEARCH BAR */
searchBtn.addEventListener('click', handleSearchQuery);
searchResultsContainer.addEventListener('click', handleResultClick);

/* OPEN RECIPE CARD */
clickedRecipeModal.addEventListener('click', (e) => {

    const card = e.target.closest('#recipe_card_wrapper');
    if (!card) return;

    const recipeId = card.dataset.id;

    const button = e.target.closest('button');

    if (button?.id === 'close_btn') {
        clickedRecipeModal.close();
    } else if (button?.id === 'recipe_update_btn') {
        handleRecipeUpdate(recipeId);  
    } else if (button?.id === 'recipe_del_btn') {
        handleDelRecipe(recipeId);
    }
})

/* FUNCTIONS */
function handleAddRecipeModal() {
    delete addRecipeForm.dataset.editingId;
    addRecipeModal.showModal();
    searchResultsContainer.innerHTML = '';
}

function handleCloseBtn() {
    addRecipeModal.close();
}

function handleAddRecipeFormDataSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(addRecipeForm);
    const recipeData = Object.fromEntries(formData);
    const editingId = addRecipeForm.dataset.editingId;
    if(!editingId) {
        recipeData.id = crypto.randomUUID();
        dataBase.push(recipeData);
    } else {
        recipeData.id = editingId;
        const recipeIndex = dataBase.findIndex(recipe => recipe.id === editingId);
        dataBase[recipeIndex] = recipeData;
        delete addRecipeForm.dataset.editingId;
    }

    localStorage.setItem('dataBase', JSON.stringify(dataBase));
    addRecipeForm.reset();
    addRecipeModal.close();

    const query = searchResultsContainer.dataset.activeQuery || '';
        renderSearchResults(query); 
}

function handleSearchQuery() {
    mainHeader.classList.add('hidden');
    main.classList.add('results_state')

    if(searchBar.value.trim() !== ''){
        const query = searchBar.value.toLowerCase();
        searchResultsContainer.classList.remove('hidden');
        searchResultsContainer.dataset.activeQuery = query;
        searchBar.value = '';
        renderSearchResults(query);
    }
}

/* RENDER SEARCH RESULTS */
function renderSearchResults(query) {
    const matchingRecipes = dataBase.filter(recipe => recipe['recipe-name'].toLowerCase().includes(query) || recipe['recipe-ingredients'].toLowerCase().includes(query))
    
    searchResultsContainer.innerHTML = '';
    
    const regex = new RegExp(`(${query})`, 'gi');
    
    const recipesToRender = matchingRecipes.map(recipe => {
        const highLightedName = recipe['recipe-name'].replace(regex, `<span class='highlighted'>$1</span>`);
        const highLightedIngredients = recipe['recipe-ingredients'].replace(regex, `<span class='highlighted'>$1</span>`);
        return `<button class="search_result" data-id="${recipe.id}">
        <article>
        <h2 class="search_title">${highLightedName}</h2>
        <p class="search_ingredients">${highLightedIngredients}</p>
        </article>
        </button>`
    }).join('');
    searchResultsContainer.innerHTML = recipesToRender;  
    
}

/* SEARCHED RECIPE */
function handleResultClick(e) {
    const clickedResult = e.target.closest('.search_result');
    if(!clickedResult) return;

    const recipeId = clickedResult.dataset.id;
    const selectedRecipe = dataBase.find(recipe => recipe.id === recipeId);
    const ingredientItems = selectedRecipe['recipe-ingredients'].split(', ').map(ingredient => `<li class="ingredient">${ingredient}</li>`).join('');
    
    
    clickedRecipeModal.innerHTML = `
    <article id="recipe_card_wrapper" data-id="${selectedRecipe.id}">
    <h2 id="recipe_card_name">${selectedRecipe['recipe-name']}<button type="button" id="recipe_update_btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <g id="Edit / Edit_Pencil_01">
            <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            </svg>
        </button></h2>
    <section id="recipe_extra_info_wrapper">
        <h3 class="recipe_extra_info" id="recipe_card_prep_time">Prep time: <span class="recipe_card_num_value">${selectedRecipe['recipe-prep-time']} min</span></h3>
        <h3 class="recipe_extra_info" id="recipe_card_cook_time">Cook time: <span class="recipe_card_num_value">${selectedRecipe['recipe-cook-time']} min</span></h3>
        <h3 class="recipe_extra_info" id="recipe_card_servings">Servings: <span class="recipe_card_num_value">${selectedRecipe['recipe-servings']}</span></h3>
    </section>
    <section id="prep_text">
        <h3 class="recipe_card_subtitle">Preparation:</h3>
        <p id="recipe_prep_text">${selectedRecipe['recipe-preparation']}</p>
    </section>
    <section id="ing_list">
        <h3 class="recipe_card_subtitle">Ingredients:</h3>
        <ul id="ingredients_list">${ingredientItems}</ul>
    </section>
    <button type="button" id="close_btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    </button>
    </article>
    `
    clickedRecipeModal.showModal();

    }

    /* RECIPE UPDATE FUNCTION */
    function handleRecipeUpdate(recipeId) {
        const selectedRecipe = dataBase.find(recipe => recipe.id === recipeId);
        Object.entries(selectedRecipe).forEach(([key, value]) => {
            if(addRecipeForm.elements[key]) {
                addRecipeForm.elements[key].value = value;
            }
        })
        addRecipeForm.dataset.editingId = recipeId;
        clickedRecipeModal.close();
        addRecipeModal.showModal();
    }