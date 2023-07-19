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