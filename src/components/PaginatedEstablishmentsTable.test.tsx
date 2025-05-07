import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { EstablishmentsTable } from "./EstablishmentsTable";
import { PaginatedEstablishmentsTable } from "./PaginatedEstablishmentsTable";
import * as ratingsAPI from "../api/ratingsAPI";
import * as countriesAPI from "../api/countriesAPI";
import * as authorityAPI from "../api/authorityAPI";
import { BrowserRouter } from "react-router-dom";


jest.mock("../api/ratingsAPI");
jest.mock("../api/countriesAPI");
jest.mock("../api/authorityAPI");

const mockCountries = [{ id: "CTY1", name: "Country1" }];
const mockAuthorities = [{ LocalAuthorityId: "AUTH1", Name: "Authority1" }];
const establishmentsDefault = [
    { FHRSID: "1", BusinessName: "Default Cafe", RatingValue: "3" }
];
const establishmentsByCountry = [
    { FHRSID: "2", BusinessName: "Country Eatery", RatingValue: "4" }
];
const establishmentsByAuthority = [
    { FHRSID: "3", BusinessName: "Authority Diner", RatingValue: "5" }
];


jest.mock("../api/ratingsAPI", () => ({
    getEstablishmentRatings: jest.fn(() => Promise.resolve({ establishments: establishmentsDefault })),
    getEstablishmentRatingsByCountryId: jest.fn(() => Promise.resolve({ establishments: establishmentsByCountry })),
    getEstablishmentRatingsByAuthorityId: jest.fn(() => Promise.resolve({ establishments: establishmentsByAuthority })),
}));
jest.mock("../api/countriesAPI", () => ({
    getCountries: jest.fn(() => Promise.resolve({ countries: mockCountries })),
}));
jest.mock("../api/authorityAPI", () => ({
    getAuthorities: jest.fn(() => Promise.resolve({ authorities: mockAuthorities })),
}));

const renderWithRouter = (ui: any) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("PaginatedEstablishmentsTable filtering", () => {
    beforeEach(() => {
        (ratingsAPI.getEstablishmentRatings as jest.Mock).mockResolvedValue({
            establishments: establishmentsDefault
        });
        (ratingsAPI.getEstablishmentRatingsByCountryId as jest.Mock).mockResolvedValue({
            establishments: establishmentsByCountry
        });
        (ratingsAPI.getEstablishmentRatingsByAuthorityId as jest.Mock).mockResolvedValue({
            establishments: establishmentsByAuthority
        });
        (countriesAPI.getCountries as jest.Mock).mockResolvedValue({
            countries: mockCountries
        });
        (authorityAPI.getAuthorities as jest.Mock).mockResolvedValue({
            authorities: mockAuthorities
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows establishments filtered by selected country", async () => {
        render(<PaginatedEstablishmentsTable />);
        renderWithRouter(<PaginatedEstablishmentsTable />);
        
        await waitFor(() => expect(countriesAPI.getCountries).toHaveBeenCalled());
        
        const countryDropdown = await screen.findByLabelText(/filter by/i, { selector: "select#country-dropdown" });
        fireEvent.change(countryDropdown, { target: { value: "CTY1" } });
        await waitFor(() => expect(screen.getByText("Country Eatery")).toBeInTheDocument());
        
        await waitFor(() => {
            expect(ratingsAPI.getEstablishmentRatingsByCountryId).toHaveBeenCalledWith(expect.any(Number), "CTY1");
            expect(screen.getByText("Country Eatery")).toBeInTheDocument();
        });
    });

    it("shows establishments filtered by selected authority", async () => {
        render(<PaginatedEstablishmentsTable />);
        renderWithRouter(<PaginatedEstablishmentsTable />);
        
        await waitFor(() => expect(authorityAPI.getAuthorities).toHaveBeenCalled());
        
        const authorityDropdown = await screen.findByLabelText(/authority/i, { selector: "select#authority-dropdown" });
        fireEvent.change(authorityDropdown, { target: { value: "AUTH1" } });
        await waitFor(() => expect(screen.getByText("Authority Diner")).toBeInTheDocument());
        
        await waitFor(() => {
            expect(ratingsAPI.getEstablishmentRatingsByAuthorityId).toHaveBeenCalledWith(expect.any(Number), "AUTH1");
            expect(screen.getByText("Authority Diner")).toBeInTheDocument();
        });
    });

    it("shows all establishments when no filter is applied", async () => {
        render(<PaginatedEstablishmentsTable />);
        await waitFor(() => expect(screen.getByText("Default Cafe")).toBeInTheDocument());
        renderWithRouter(<PaginatedEstablishmentsTable />);
        
        await waitFor(() => {
            expect(ratingsAPI.getEstablishmentRatings).toHaveBeenCalled();
            expect(screen.getByText("Default Cafe")).toBeInTheDocument();
        });
    });
});
