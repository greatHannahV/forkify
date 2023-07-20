import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

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

export const loadRecipe = async function(id) {
    try {
        const data = await getJSON(`${API_URL}${id}`);

        const { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,

        };
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
            const data = await getJSON(`${API_URL}?search=${query}`)
            state.search.result = data.data.recipes.map(rec => {
                return {
                    id: rec.id,
                    title: rec.title,
                    publisher: rec.publisher,
                    image: rec.image_url,
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
    //bookmark
export const addBookmark = function(recipe) {
    //add bookmark
    state.bookmarks.push(recipe);
    //mark cur recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    //mark cur recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
}