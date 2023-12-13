import { UseItemsStore } from "../store/store";
import ReactPaginate from 'react-paginate';

export const Pagination = () => {

    const setCurrentPage = UseItemsStore(state => state.setCurrentPage);
    const currentPage = UseItemsStore(state => state.currentPage);
    const total = UseItemsStore(state => state.total);

    const pageChange = (e) => {
        setCurrentPage(e.selected);
    }

    return (
                <div className="flex pagination-elements">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={pageChange}
                        forcePage={(currentPage)?currentPage:0}
                        pageRangeDisplayed={5}
                        pageCount={total/12}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                    />
                </div>
            )

}