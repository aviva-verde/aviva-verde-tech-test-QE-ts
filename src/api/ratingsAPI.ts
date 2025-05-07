export type EstablishmentsType = {
  establishments: {}[];
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

export function getEstablishmentRatings(
    pageNum: number
): Promise<EstablishmentsType> {
  return fetch(
      `http://api.ratings.food.gov.uk/Establishments/basic/${pageNum}/10`,
      { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}

export function getEstablishmentRatingsByAuthorityId(
    pageNum: number,
    localAuthorityId: string,
): Promise<EstablishmentsType> {
  return fetch(
      `http://api.ratings.food.gov.uk/Establishments?localAuthorityId=${localAuthorityId}&pageNumber=${pageNum}&pageSize=10`,
      { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}

export function getEstablishmentRatingsByCountryId(
    pageNum: number,
    countryId: string,
): Promise<EstablishmentsType> {
  return fetch(
      `http://api.ratings.food.gov.uk/Establishments?countryId=${countryId}&pageNumber=${pageNum}&pageSize=10`,
      { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}

export function getEstablishmentDetails(
    id: string,
): Promise<any> {
  return fetch(
      `http://api.ratings.food.gov.uk/Establishments/${id}`,
      { headers: { "x-api-version": "2" } }
  ).then((res) => res.json());
}
