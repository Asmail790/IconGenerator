import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  activeIndexInWindow: number;
  urlPageWindow: { url: string; page: number }[];
  lastPageNumber: number;
};

export function StyledPagination(props: Props) {
  const activeIndex = props.activeIndexInWindow;
  const urlProps = props.urlPageWindow;
  const lastPageNumber = props.lastPageNumber;

  const pageItems = urlProps.map(({ url, page: pageNumber }, i) => {
    if (i == activeIndex) {
      return (
        <PaginationItem key={i}>
          <PaginationLink href={url} isActive>
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <PaginationItem key={i}>
        <PaginationLink href={url}>
        {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );
  });

  const pageBeforeExist = 0 < activeIndex;
  const prevPageItem = pageBeforeExist ? (
    <PaginationItem key={-1}>
      <PaginationPrevious href={urlProps[activeIndex - 1]!.url}>
      </PaginationPrevious>
    </PaginationItem>
  ) : null;

  const nextPageExist = activeIndex < urlProps.length-1;
  const nextPageItem = nextPageExist ? (
    <PaginationItem key={-2}>
      <PaginationNext href={urlProps[activeIndex + 1]!.url}>
      </PaginationNext>
    </PaginationItem>
  ) : null;

  const morePagesExist = urlProps[urlProps.length - 1]!.page < lastPageNumber;
  const pageEllipsisItem = morePagesExist ? (
    <PaginationItem key={-3}>
      <PaginationEllipsis />
    </PaginationItem>
  ) : null;
  const paginationAll = [
    prevPageItem,
    ...pageItems,
    pageEllipsisItem,
    nextPageItem,
  ];

  return (
    <Pagination className="py-8">
      <PaginationContent>{paginationAll}</PaginationContent>
    </Pagination>
  );
}
