const buttonStyle = {
  margin: "0 5px",
};

type EstablishmentsTableNavigationType = {
  pageNum: number;
  pageCount: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export const EstablishmentsTableNavigation = (
    props: EstablishmentsTableNavigationType
) => {
  const { pageNum, pageCount, onPreviousPage, onNextPage } = props;
  return (
      <nav style={{ marginTop: 16 }}>
        {
          <button
              type="button"
              style={buttonStyle}
              onClick={onPreviousPage}
          >
            -
          </button>
        }
        {pageNum}
        {
          <button
              type="button"
              style={buttonStyle}
              disabled={pageNum >= pageCount}
              onClick={onNextPage}
          >
            +
          </button>
        }
      </nav>
  );
};
