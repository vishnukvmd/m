import { Link } from "gatsby";
import { ColorPalette } from "parsers/colors";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

/** The data for each page required by the {@link PageListing} component */
export interface Page {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

interface PageListingProps {
    /** The ordered list of pages to show */
    pages: Page[];
    /** A function that is called when the user hovers over a link to a page */
    setHoverPage: (page: Page | undefined) => void;
}

/** A component that renders a listing of the given pages */
export const PageListing: React.FC<PageListingProps> = ({
    pages,
    setHoverPage,
}) => {
    const n = pages.length;
    return (
        <PageGrid>
            {pages.map((page, i) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <PageItem {...page}>
                        <PageItemP>{page.title.toLowerCase()}</PageItemP>
                        <PageItemCount>{n - i}</PageItemCount>
                    </PageItem>
                </Link>
            ))}
        </PageGrid>
    );
};

/** A CSS transition that makes the background color changes more pleasing */
export const BodyBackgroundColorTransitionStyle = createGlobalStyle`
    body {
        transition: background-color 200ms ease-out;
    }
`;

const PageGrid = styled.div`
    padding-block: 1.9rem;

    display: flex;
    flex-wrap: wrap;
    gap: 1.9rem;

    font-weight: 500;
    font-variant: small-caps;

    a {
        text-decoration: none;
    }
`;

const PageItem = styled.div<Page>`
    background-color: ${(props) => props.colors?.backgroundColor1 ?? "inherit"};
    color: ${(props) => props.colors?.color1 ?? "inherit"};
    width: 13ch;
    height: 11.7ch;
    padding-block: 0.33rem;
    padding-inline: 0.66rem;
    position: relative;
`;

const PageItemP = styled.p`
    margin: 0.25rem 0;
    /* Set the width to the width of the smallest word. This causes each word to
       be on its own line */
    width: min-content;
`;

const PageItemCount = styled.div`
    position: absolute;
    bottom: 0.59rem;
    right: 0.66rem;
    font-size: 80%;
    font-style: italic;
    opacity: 0.8;
`;
