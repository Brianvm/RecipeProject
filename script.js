const addRecipeBtn = document.getElementById('add_recipe_btn');
const addRecipeModal = document.getElementById('add_recipe_modal');
const addRecipeForm = document.getElementById('add_recipe_form');
const addRecipeModalCancelBtn = document.getElementById('add_recipe_modal_cancel_btn');


addRecipeBtn.addEventListener('click', handleAddRecipeModal);
addRecipeForm.addEventListener('submit', handleAddRecipeFormDataSubmit);
addRecipeModalCancelBtn.addEventListener('click', handleAddRecipeModalCancelBtn)

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
    localStorage.setItem(`${recipeData['recipe-name']}`, JSON.stringify(recipeData));
    addRecipeForm.reset();
    addRecipeModal.close();
}
