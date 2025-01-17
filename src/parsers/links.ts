import { getDomain, getDomainWithoutSuffix } from "tldts";
import { isDefined } from "utils/array";

/** Domains that we have special casing for (e.g. custom icons) */
export type KnownDomain =
    | "github"
    | "twitter"
    | "instagram"
    | "youtube"
    | "reddit";

/** A type guard for {@link KnownDomain}s */
export const isKnownDomain = (s: string): s is KnownDomain => {
    return (
        s == "github" ||
        s == "twitter" ||
        s == "instagram" ||
        s == "youtube" ||
        s == "reddit"
    );
};

/** Return an appropriate human readable title to describe the given domain */
const titleForKnownDomain = (d: KnownDomain) => {
    switch (d) {
        case "github":
            return "GitHub";
        case "twitter":
            return "Twitter";
        case "instagram":
            return "Instagram";
        case "youtube":
            return "YouTube";
        case "reddit":
            return "Reddit";
    }
};

/** A parsed link, with a {@link KnownDomain} (if any) attached */
export interface ParsedLink {
    /** The original string with with this link was constructed */
    url: string;
    /** A known domain which we were able to deduce for the {@link url} */
    knownDomain?: KnownDomain;
    /**
     * Title. It can be used for example to serve as the tooltip when hovering
     * on an icon linking to the url.
     */
    title?: string;
}

/** General link parser */
export const parseLink = (s: string) => {
    const domain = getDomainWithoutSuffix(s);
    const knownDomain = domain && isKnownDomain(domain) ? domain : undefined;
    // Use one of the special cased titles if it is a known domain, otherwise
    // use the domain itself (including the suffix) as the title.
    const title = knownDomain
        ? titleForKnownDomain(knownDomain)
        : // This nested fallback to convert the null to an undefined
          getDomain(s) ?? undefined;
    return { url: s, knownDomain, title };
};

type InputURLs = readonly (string | undefined)[] | undefined;

/** General link parser for a list of URLs */
export const parseLinks = (ss: InputURLs) =>
    ss?.filter(isDefined)?.map(parseLink);

/**
 * Parse a list of URLs in the context of the user's home page
 *
 * This'll apply any special business logic that is needed for the links on the
 * user's home page.
 */
export const parseUserLinks = parseLinks;

/**
 * Parse a list of urls in the context of a user page
 *
 * This'll apply the special business logic that to merge and obtain the links
 * that are shown on a normal user page. It takes the links specified in the
 * page's frontmatter, in the user's home page's frontmatter, and the URL of the
 * page itself, and merges them all to obtain the list of links that should be
 * shown on that specific page.
 *
 * @see the documentation for the links field in the [`_example` user's page
 * example `page`](../../users/_example/page/index.mdx).
 *
 * @param pageURLs URLs specified in the page's frontmatter
 * @param userPageURLs URLs specified in the user's home page frontmatter
 * @param slug The slug for the page for which we're trying to determine the
 * links. This'll be used to construct the URL to the source code on GitHub.
 */
export const parsePageLinks = (
    pageURLs: InputURLs,
    userPageURLs: InputURLs,
    slug: string
) => {
    const pageLinks = parseLinks(pageURLs);
    const userLinks = parseLinks(userPageURLs);

    // Construct a link to the page's source on GitHub using the slug.
    const sourceLink = {
        ...parseLink(`https://github.com/mrmr-io/m/tree/main/users${slug}`),
        title: "View source on GitHub",
    };

    const seenDomains = new Set<KnownDomain>();

    const result: ParsedLink[] = [];
    [...(pageLinks ?? []), sourceLink, ...(userLinks ?? [])].forEach((link) => {
        const { knownDomain } = link;
        if (knownDomain) {
            if (seenDomains.has(knownDomain)) return;
            seenDomains.add(knownDomain);
        }
        result.push(link);
    });

    return result;
};
