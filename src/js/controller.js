import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
    module.hot.accept();
}
///////////////////////////////////////

const controlRecipes = async function() {
        try {

            const id = window.location.hash.slice(1);

            if (!id) return;
            recipeView.renderSpinner()
                //1. Loading a recipe
            await model.loadRecipe(id)

            recipeView.render(model.state.recipe);

        } catch (err) {
            console.error(err);
            recipeView.renderError()

        }
    }
    //search
const controlSearchResults = async function() {
    try {
        resultsView.renderSpinner();
        //get a search query
        const query = searchView.getQuery();
        if (!query) return;
        //load a search result
        await model.loadSearchResults(query);
        //render a result
        resultsView.render(model.state.search.result);
    } catch (err) {
        console.error(err);
        recipeView.renderError()

    }
}


const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
}
init();