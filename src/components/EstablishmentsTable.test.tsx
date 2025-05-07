import { render, screen, fireEvent, within} from "@testing-library/react";
import { EstablishmentsTable } from "./EstablishmentsTable";

jest.mock("./EstablishmentsTableRow", () => ({
    EstablishmentsTableRow: ({ establishment }: any) => (
        <tr>
            <td>{establishment && establishment.BusinessName}</td>
            <td>{establishment && establishment.RatingValue}</td>
        </tr>
    ),
}));

const mockEstablishments = [
    { FHRSID: "1", BusinessName: "Cafe One", RatingValue: "5" },
    { FHRSID: "2", BusinessName: "Bistro Two", RatingValue: "4" },
];

const mockFavourites = [
    { FHRSID: "2", BusinessName: "Bistro Two", RatingValue: "4" },
];

describe("EstablishmentsTable font size", () => {
    it("should have table headings with a font size of 20px", () => {
        render(
            <EstablishmentsTable
                establishments={[]}
                isLoading={false}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );

        const businessNameHeader = screen.getByText("Business Name");
        const ratingHeader = screen.getByText("Rating Value");

        expect(document.body.contains(businessNameHeader)).toBe(true);
        expect(document.body.contains(ratingHeader)).toBe(true);

        const businessNameStyle = window.getComputedStyle(businessNameHeader);
        const ratingHeaderStyle = window.getComputedStyle(ratingHeader);

        expect(businessNameStyle.fontSize).toBe("20px");
        expect(ratingHeaderStyle.fontSize).toBe("20px");
    });
});

describe("EstablishmentsTable", () => {
    it("renders table headings", () => {
        render(
            <EstablishmentsTable
                establishments={[]}
                isLoading={false}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.getByText("Business Name")).toBeInTheDocument();
        expect(screen.getByText("Rating Value")).toBeInTheDocument();
    });

    it("shows loading indicator when loading", () => {
        render(
            <EstablishmentsTable
                establishments={mockEstablishments}
                isLoading={true}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        // Should not render establishment names while loading
        expect(screen.queryByText("Cafe One")).toBeNull();
    });

    it("renders rows for establishments when not loading", () => {
        render(
            <EstablishmentsTable
                establishments={mockEstablishments}
                isLoading={false}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.getByText("Cafe One")).toBeInTheDocument();
        expect(screen.getByText("Bistro Two")).toBeInTheDocument();
        expect(screen.getAllByText("Rating Value")[0]).toBeInTheDocument();
    });

    it("renders nothing for null or undefined establishments", () => {
        const { container } = render(
            <EstablishmentsTable
                establishments={undefined}
                isLoading={false}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );

        expect(container.querySelectorAll("tbody tr").length).toBe(1);
    });

    it("renders favourites section with correct data", () => {
        render(
            <EstablishmentsTable
                establishments={mockEstablishments}
                isLoading={false}
                favourites={mockFavourites}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.getByText("Favourites")).toBeInTheDocument();


        const favouritesHeading = screen.getByText("Favourites");

        const favouritesSection = favouritesHeading.closest("div");

        expect(within(favouritesSection!).getByText("Bistro Two")).toBeInTheDocument();
        expect(within(favouritesSection!).getByRole("button", { name: /remove/i })).toBeInTheDocument();

    });

    it("does not render favourites section if favourites is empty", () => {
        render(
            <EstablishmentsTable
                establishments={mockEstablishments}
                isLoading={false}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.queryByText("Favourites")).not.toBeInTheDocument();
    });

    it("calls onToggleFavourite when remove button is clicked", () => {
        const onToggle = jest.fn();
        render(
            <EstablishmentsTable
                establishments={mockEstablishments}
                isLoading={false}
                favourites={mockFavourites}
                onToggleFavourite={onToggle}
            />
        );
        fireEvent.click(screen.getByRole("button", { name: /remove/i }));
        expect(onToggle).toHaveBeenCalledWith(mockFavourites[0]);
    });

    it('does not render establishments when isLoading is true', () => {
        render(
            <EstablishmentsTable
                establishments={[
                    { BusinessName: "Cafe Example", RatingValue: "5", FHRSID: "1" }
                ]}
                isLoading={true}
                favourites={[]}
                onToggleFavourite={jest.fn()}
            />
        );
        expect(screen.queryByText("Cafe Example")).not.toBeInTheDocument();
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

});
