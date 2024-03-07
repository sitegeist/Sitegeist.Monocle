/**
 * This file is part of the Sitegeist.Monocle package
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

type BuildUrlOptions = {
    queryParams: { [name: string]: string };
};

export const buildUrl = (baseUrl: string, options: BuildUrlOptions) => {
    const url = new URL(baseUrl, window.location.origin);

    for (const [key, value] of Object.entries(options.queryParams)) {
        url.searchParams.set(key, value);
    }

    return url.toString();
};
