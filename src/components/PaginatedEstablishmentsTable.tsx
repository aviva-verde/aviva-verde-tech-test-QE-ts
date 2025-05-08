import { useState, useEffect } from "react";
import { EstablishmentsTable } from "./EstablishmentsTable";
import { EstablishmentsTableNavigation } from "./EstablishmentsTableNavigation";
import {
    getEstablishmentRatings,
    getEstablishmentRatingsByAuthorityId,
    getEstablishmentRatingsByCountryId
} from "../api/ratingsAPI";
import {getAuthorities} from "../api/authorityAPI";
import {getCountries} from "../api/countriesAPI";

const tableStyle = {
  background: "rgba(51, 51, 51, 0.9)",
  padding: "10px",
  width: "max-content",
  marginLeft: "50px",
  color: "white",
    fontSize: "21px"
};

export const PaginatedEstablishmentsTable = () => {
  const [error, setError] =
      useState<{ message: string; [key: string]: string }>();
  const [establishments, setEstablishments] = useState<
      { [key: string]: string }[]
  >([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [authorities, setAuthorities] = useState<any[]>([]);
    const [localAuthorityId, setLocalAuthorityId] = useState<string>("");
    const [countries, setCountries] = useState<any[]>([]);
    const [countryId, setCountryId] = useState<string>("");
    const [favourites, setFavourites] = useState<{ [key: string]: string }[]>([]);


    function loadEstablishmentRatings() {
        if (localAuthorityId !== "") {
            getEstablishmentRatingsByAuthorityID();
        } else if (countryId !== "") {
            getEstablishmentRatingsByCountryID();
        } else {
            getAllEstablishmentRatings();
        }
    }

  useEffect(() => {
      setIsLoading(true)

      getCountries().then(data => {
              setCountries(data.countries || []);
          },
          (error) => {
              setError(error);
          });

      getAuthorities().then(data => {
              setAuthorities(data.authorities || []);
          },
          (error) => {
              setError(error);
          });

      loadEstablishmentRatings();
      // eslint-disable-next-line
  }, [countryId, localAuthorityId]);

    function getAllEstablishmentRatings() {
    getEstablishmentRatings(pageNum).then(
        (result) => {
            setEstablishments(result.establishments);
        },
        (error) => {
            setError(error);
        }
    ).finally(() => setIsLoading(false));
    }

    function getEstablishmentRatingsByAuthorityID() {
        getEstablishmentRatingsByAuthorityId(pageNum, localAuthorityId).then(
            (result) => {
                setEstablishments(result.establishments);
            },
            (error) => {
                setError(error);
            }
        ).finally(() => setIsLoading(false));
  }

    function getEstablishmentRatingsByCountryID() {
        getEstablishmentRatingsByCountryId(pageNum, countryId).then(
            (result) => {
                setEstablishments(result.establishments);
            },
            (error) => {
                setError(error);
            }
        ).finally(() => setIsLoading(false));
    }

    async function handlePreviousPage() {
        setPageNum(pageNum - 1);
        loadEstablishmentRatings();
    }

    async function handleNextPage() {
        setIsLoading(true)
        pageNum < pageCount && setPageNum(pageNum + 1);
        loadEstablishmentRatings();
    }

    function handleToggleFavourite(establishment: any) {
        setFavourites(prevFavs => {
            return [...prevFavs, establishment];
        });
    }

    function handleRemoveFavourite(establishment: any) {
        setFavourites(prevFavs => {
            if (prevFavs.find(fav => fav.FHRSID === establishment.FHRSID)) {
                return prevFavs.filter(fav => fav.FHRSID !== establishment.FHRSID);
            } else {
                return [...prevFavs, establishment];
            }
        });
    }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
        <div style={tableStyle}>
            <h2>Food Hygiene Ratings</h2>

            <div style={{marginBottom: 16}}>
                <label htmlFor="authority-dropdown">Filter by: </label>
                <select
                    id="country-dropdown"
                    value={countryId}
                    onChange={e => {
                        setLocalAuthorityId("");
                        setCountryId(e.target.value);
                        setPageNum(1); // reset to first page when country changes
                    }}
                >
                    <option value="">Country</option>
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>

                <select
                    id="authority-dropdown"
                    value={localAuthorityId}
                    onChange={e => {
                        setCountryId("");
                        setLocalAuthorityId(e.target.value);
                        setPageNum(1); // reset to first page when authority changes
                    }}
                >
                    <option value="">Authority</option>
                    {authorities.map(auth => (
                        <option key={auth.LocalAuthorityId} value={auth.LocalAuthorityId}>
                            {auth.Name}
                        </option>
                    ))}
                </select>

            </div>

            <EstablishmentsTable
                establishments={establishments}
                isLoading={isLoading}
                favourites={favourites}
                onToggleFavourite={handleToggleFavourite}
                onRemoveFavourite={handleRemoveFavourite}
            />
            <EstablishmentsTableNavigation
                pageNum={pageNum}
                pageCount={pageCount}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
            />
        </div>
    );
  }
};
