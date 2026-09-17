const addRecipeBtn = document.getElementById('add_recipe_btn');
const addRecipeModal = document.getElementById('add_recipe_modal');
const addRecipeForm = document.getElementById('add_recipe_form');
const addRecipeModalCloseBtn = document.getElementById('add_recipe_modal_close_btn');
const searchBar = document.getElementById('search_bar');
const searchBtn = document.getElementById('search_button');
const searchResultsConatiner = document.getElementById('search_results_container');
const clickedRecipeModal = document.getElementById('clicked_recipe_modal');
const dataBase = JSON.parse(localStorage.getItem('dataBase')) || [];

/* ADD RECIPE MODAL */
addRecipeBtn.addEventListener('click', handleAddRecipeModal);
addRecipeForm.addEventListener('submit', handleAddRecipeFormDataSubmit);
addRecipeModalCloseBtn.addEventListener('click', handleCloseBtn);

/* SEARCH BAR */
searchBtn.addEventListener('click', handleSearchQuery);
searchResultsConatiner.addEventListener('click', handleResultClick);

/* FUNCTIONS */
function handleAddRecipeModal() {
    delete addRecipeForm.dataset.editingId;
    addRecipeModal.showModal();
    searchResultsConatiner.innerHTML = '';
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

    const query = searchResultsConatiner.dataset.activeQuery || '';
        renderSearchResults(query); 
}

function handleSearchQuery() {
    if(searchBar.value.trim() !== ''){
        const query = searchBar.value.toLowerCase();
        searchResultsConatiner.classList.remove('hidden');
        searchResultsConatiner.dataset.activeQuery = query;
        searchBar.value = '';
        renderSearchResults(query);
    }
}

/* RENDER SEARCH RESULTS */
function renderSearchResults(query) {
    const matchingRecipes = dataBase.filter(recipe => recipe['recipe-name'].toLowerCase().includes(query) || recipe['recipe-ingredients'].toLowerCase().includes(query))
    
    searchResultsConatiner.innerHTML = '';
    
    const regex = new RegExp(`(${query})`, 'gi');
    
    const recipesToRender = matchingRecipes.map(recipe => {
        const highLightedName = recipe['recipe-name'].replace(regex, `<span class='highlighted'>$1</span>`);
        const highLightedIngredients = recipe['recipe-ingredients'].replace(regex, `<span class='highlighted'>$1</span>`);
        return `<button class="recipe_wrapper" data-id="${recipe.id}">
        <article>
        <h2 class="recipe_title">${highLightedName}</h2>
        <p>${highLightedIngredients}</p>
        </article>
        </button>`
    }).join('');
    searchResultsConatiner.innerHTML = recipesToRender;  
    
}

/* SEARCHED RECIPE */
function handleResultClick(e) {
    const clickedResult = e.target.closest('.recipe_wrapper');
    if(!clickedResult) return;

    const recipeId = clickedResult.dataset.id;
    const selectedRecipe = dataBase.find(recipe => recipe.id === recipeId);
    const ingredientItems = selectedRecipe['recipe-ingredients'].split(', ').map(ingredient => `<li class="ingredient">${ingredient}</li>`).join('');
    
    
    clickedRecipeModal.innerHTML = `
    <article id="recipe_card_wrapper">
    <h2 id="recipe_card_name">${selectedRecipe['recipe-name']}</h2>
    <h3 id="recipe_card_prep_time">Prep time: <span class="recipe_card_num_value">${selectedRecipe['recipe-prep-time']}</span> min</h3>
    <h3 id="recipe_card_cook_time">Cook time: <span class="recipe_card_num_value">${selectedRecipe['recipe-cook-time']}</span> min</h3>
    <h3 id="recipe_card_servings">Servings: <span class="recipe_card_num_value">${selectedRecipe['recipe-servings']}</span></h3>
    <h3 class="recipe_card_subtitle">Preparation:</h3>
    <p id="recipe_prep_text">${selectedRecipe['recipe-preparation']}</p>
    <h3 class="recipe_card_subtitle">Ingredients:</h3>
    <ul id="ingredients_list">${ingredientItems}</ul>
    <button type="button" id="close_btn">X</button>
    <button type="button" id="recipe_update_btn">Update</button>
    <button type="button" id="recipe_del_btn">DELETE</button>
    </article>
    `
    clickedRecipeModal.showModal();

    clickedRecipeModal.addEventListener('click', (e) => {
        if (e.target.id === 'close_btn') {
            clickedRecipeModal.close();
        } else if (e.target.id === 'recipe_update_btn') {
            handleRecipeUpdate(recipeId);  
        } else if (e.target.id === 'recipe_del_btn') {
            handleDelRecipe(recipeId);
        }
    })
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

    /* RECIPE DEL FUNCTION */
    function handleDelRecipe(recipeId) {
        const delRecipeIndex = dataBase.findIndex(recipe => recipe.id === recipeId)
        dataBase.splice(delRecipeIndex, 1);
        localStorage.setItem('dataBase', JSON.stringify(dataBase));
        const query = searchResultsConatiner.dataset.activeQuery || '';
        renderSearchResults(query);
        clickedRecipeModal.close();
    }