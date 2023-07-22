import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js'

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
            recipeView.renderSpinner();
            //0.update results view to mark selected res
            resultsView.update(model.getSearchResultsPage());
            //1. Loading a recipe
            await model.loadRecipe(id);
            //2.rendering a recipe
            recipeView.render(model.state.recipe);
            //updated bookmarks
            bookmarksView.update(model.state.bookmarks);
            //test
            // controlServings();
        } catch (err) {
            console.error(err);
            recipeView.renderError()

        }
    }
    //search
const controlSearchResults = async function() {
        try {
            resultsView.renderSpinner();
            //1.get a search query
            const query = searchView.getQuery();
            if (query.length === 0) {
                this._errorMessage = `I don't see anything`;
            };

            //2.load a search result
            await model.loadSearchResults(query);
            //3.render a result
            // resultsView.render(model.state.search.result);
            resultsView.render(model.getSearchResultsPage());
            //4.render pagination btns
            paginationView.render(model.state.search);

        } catch (err) {
            console.error(err);
            recipeView.renderError()

        }
    }
    //pagination's btns clicks
const controlPagination = function(goToPage) {
        //1.render a NEW result
        // resultsView.render(model.state.search.result);
        resultsView.render(model.getSearchResultsPage(goToPage));
        //2.render NEW pagination btns
        paginationView.render(model.state.search);

    }
    //servings btns
const controlServings = function(newServings) {
    //update the recipe servings (in state)
    model.updateServings(newServings);
    //update the view as well
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);

};
//bookmark
const controlAddBookmark = function() {
    //add or remove a bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    //update recipe view
    recipeView.update(model.state.recipe);
    //render bookmarks
    bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks)
};
const controlAddRecipe = async function(newRecipe) {
    try {
        //show loading
        addRecipeView.renderSpinner();
        await model.uploadRecipe(newRecipe);
        //render
        recipeView.render(model.state.recipe);
        //success message
        addRecipeView.renderMessage();
        //render bookmark view
        bookmarksView.render(model.state.bookmarks);
        //change id in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        //close form window
        setTimeout(function() {
            addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC * 1000);


    } catch (err) {
        console.error('💥', err);
        addRecipeView.renderError(err.message);
    }
    location.reload();

}

/**
 * not need for the app
 */
const newFeature = function() {
    console.log('welcome to git');
}

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark)
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarksView.addHandlerRender(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe)
    newFeature();

}
init();