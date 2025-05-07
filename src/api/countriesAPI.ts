export type Countriesype = {
  countries: {}[];
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

export function getCountries(): Promise<Countriesype> {
  return fetch(
    `http://api.ratings.food.gov.uk/Countries/basic`,
    { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}
