export type AuthoritiesType = {
  authorities: {}[];
  meta: {
    dataSource: string;
    extractDate: string;
    itemCount: number;
    returncode: string;
    totalCount: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  };
  links: [
    {
      rel: string;
      href: string;
    }
  ];
};

export function getAuthorities(): Promise<AuthoritiesType> {
  return fetch(
    `http://api.ratings.food.gov.uk/Authorities/basic`,
    { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}
