import {Link} from "react-router-dom";
import React from "react";

export const EstablishmentsTableRow: React.FC<{
    establishment: { [key: string]: string } | null | undefined;
    favourites: { [key: string]: string }[];
    onToggleFavourite: (establishment: { [key: string]: string }) => void;
}> = ({ establishment, favourites, onToggleFavourite }) => {
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={!!favourites.find(f => f.FHRSID === establishment?.FHRSID)}
                    onChange={() => establishment ? onToggleFavourite(establishment) : undefined}
                />
            </td>

            <td>
                {establishment?.FHRSID ? (
                    <Link to={`/establishment/${establishment.FHRSID}`}
                          style={{color: "inherit", textDecoration: "underline", cursor: "pointer"}}>
                        {establishment.BusinessName}
                    </Link>
                ) : (
                    establishment?.BusinessName
                )}
            </td>

            <td>{establishment?.RatingValue}</td>
        </tr>
    );
};
