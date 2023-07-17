import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.jsv'

import 'core-js/stable';
import 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

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
            recipeView.renderError()

        }
    }
    //search
const controlSearchResults = async function() {
    try {
        await model.loadSearchResults('pizza');
        console.log(model.state.search.result);

    } catch (err) {
        recipeView.renderError()
    }
}
controlSearchResults()

const init = function() {
    recipeView.addHandlerRender(controlRecipes)
}
init();