import View from './View.js';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    //pagination's btns clicks
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);

        })
    }
    _generateMarkup() {
        const numPages = Math.ceil(this._data.result.length / this._data.resultPerPage);
        const currPage = this._data.page;
        //page 1, and other pages
        if (currPage === 1 && numPages > 1) {
            return this._generateMarkupButtonNext(currPage);
        }
        //last page
        if (currPage === numPages && numPages > 1) {
            return this._generateMarkupButtonPrev(currPage)
        }
        //other pages
        if (currPage < numPages) {
            return this._generateMarkupButtonPrev(currPage) + this._generateMarkupButtonNext(currPage)

        }
        //page 1, and no other pages
        return '';

    }
    _generateMarkupButtonPrev(currPage) {
        return `
          <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage-1 }</span>
          </button>
        `;
    }

    _generateMarkupButtonNext(currPage) {
        return `
          <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span> Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }
}
export default new PaginationView()