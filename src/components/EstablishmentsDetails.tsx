import {getEstablishmentDetails} from "../api/ratingsAPI";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
};

const formatAddress = (est: any) =>
    [est.AddressLine1, est.AddressLine2, est.AddressLine3, est.AddressLine4, est.PostCode]
        .filter(Boolean)
        .join(", ");

const EstablishmentsDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [establishment, setEstablishment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getEstablishmentDetails(id)
            .then(setEstablishment)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!establishment) return <div>Not found</div>;

    return (
        <div style={{ padding: 24 }}>
            <h2>{establishment.BusinessName}</h2>
            <p>
                <strong>Address:</strong> {formatAddress(establishment)}
            </p>
            <p>
                <strong>Date of Inspection:</strong> {formatDate(establishment.RatingDate)}
            </p>
            <button onClick={() => history.push("/")}>Go Back</button>
        </div>
    );
};

export default EstablishmentsDetails;
