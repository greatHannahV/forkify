import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { AJAX, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        resultPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],

}
const createRecipeObject = function(data) {
    const { recipe } = data.data;
    return {

        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }) // if recipe.key exists than will be spread op and added key
    }
}
export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        //added bookmark to any chosen elms
        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch (err) {
        throw (err);
    }
};
//search
export const loadSearchResults = async function(query) {
        try {
            state.search.query = query;
            const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
            state.search.result = data.data.recipes.map(rec => {
                return {
                    id: rec.id,
                    title: rec.title,
                    publisher: rec.publisher,
                    image: rec.image_url,
                    ...(rec.key && { key: rec.key })
                }
            });

            state.search.page = 1;
        } catch (err) {
            throw (err);
        }
    }
    // loadSearchResults('pizza')

//pagination part
export const getSearchResultsPage = function(page = state.search.page) {
        state.search.page = page;
        const start = (page - 1) * state.search.resultPerPage; //0
        const end = page * state.search.resultPerPage; //9

        return state.search.result.slice(start, end)

    }
    //servings btns
export const updateServings = function(newServings) {
        state.recipe.ingredients.forEach(ing => {
            ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        })
        state.recipe.servings = newServings
    }
    //local storage
const persistBookmarks = function() {
        localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

    }
    //bookmark
export const addBookmark = function(recipe) {
    //add bookmark
    state.bookmarks.push(recipe);
    //mark cur recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    //mark cur recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

//from local storage
const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);

}
init();

//debugging
const clearBookmarks = function() {
        localStorage.clear('bookmarks')
    }
    // clearBookmarks()


//object to array  Object.entries(newRecipe)
export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map(el => el.trim())
                if (ingArr.length !== 3)
                    throw new Error(
                        'Wrong ingridient format.Please correct it.');
                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description };
            })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            id: newRecipe.id,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,


        }
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

    } catch (err) {
        throw err;
    }

}