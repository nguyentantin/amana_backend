export interface PaginationMeta {
    /** Determine the current page being paginated. */
    currentPage: number;

    /** Determine how many items are being shown per page. */
    perPage: number;

    /** Determine "index" of first item start in this page */
    from: number;

    /** Determine "index" of last item end in this page */
    to: number;

    /** Determine the total number of items in the data store. */
    total: number;

    /** The page number of the last available page. */
    lastPage: number;
}
