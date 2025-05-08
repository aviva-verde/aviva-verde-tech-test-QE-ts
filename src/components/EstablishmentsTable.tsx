import React from "react";
import { EstablishmentsTableRow } from "./EstablishmentsTableRow";
import PropTypes from "prop-types";

const headerStyle: { [key: string]: string | number } = {
  paddingBottom: "10px",
  textAlign: "left",
  fontSize: "20px",
};

export const EstablishmentsTable: React.FC<{
  establishments: { [key: string]: string }[] | null | undefined;
  isLoading: boolean;
  favourites: { [key: string]: string }[];
  onToggleFavourite: (establishment: { [key: string]: string }) => void;
  onRemoveFavourite: (establishment: { [key: string]: string }) => void;
}> = ({ establishments, isLoading, favourites, onToggleFavourite, onRemoveFavourite }) => {
  console.log("EstablishmentsTable", establishments, isLoading, favourites);
  return (
      <>
        <table>
          <tbody>
          {isLoading ?
              <h3> <>Loading...</> </h3> :
              (
                <>
              <tr>
                <th style={headerStyle}>Business Name</th>
                <th style={headerStyle}>Rating Value</th>
              </tr>
              {establishments &&
              establishments?.map(
                  (
                      establishment: { [key: string]: string } | null | undefined,
                      index: React.Key | null | undefined
                  ) => (
                      <EstablishmentsTableRow
                          key={index}
                          establishment={establishment}
                          favourites={favourites}
                          onToggleFavourite={onToggleFavourite}
                      />
                  )
              )}
              </>
            )}
          </tbody>
        </table>
        {favourites.length > 0 && (
            <div style={{marginTop: "30px"}}>
              <h3>Favourites</h3>
              <table>
                <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Rating Value</th>
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {favourites.map(establishment => (
                    <tr key={establishment.FHRSID}>
                      <td>{establishment.BusinessName}</td>
                      <td>{establishment.RatingValue}</td>
                      <td>
                        <button onClick={() => onRemoveFavourite(establishment)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

      </>
  );
};

EstablishmentsTable.propTypes = {
  establishments: PropTypes.array,
};
