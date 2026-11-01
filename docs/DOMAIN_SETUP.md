# mathematicsvideos.org

The Math Videos domain is registered through **Dynadot** and connected to **BenjaminYazdi/math-videos** on GitHub Pages. Domain ownership is verified in BenjaminYazdi's GitHub account. Auto-renew is disabled: **Manual Renewal** is selected. The current registration expires **November 1, 2027**.

## DNS configuration

Use Dynadot DNS with these records (TTL: 5 minutes):

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | benjaminyazdi.github.io |
| TXT | _github-pages-challenge-BenjaminYazdi | Retain the verification value supplied by GitHub account Settings → Pages. |

The `www` CNAME target is the account hostname only, without a repository path. GitHub routes the separate custom domain to this repository. Keep the verification TXT record in place.

## GitHub Pages configuration

- Repository: **BenjaminYazdi/math-videos**
- Publishing source: **GitHub Actions**
- Custom domain: **mathematicsvideos.org**
- Actions variable: **PUBLISH_SITE=true**
- Workflow: **Check and deploy Math Videos**
- HTTPS: enable **Enforce HTTPS** once GitHub provisions the certificate.

The workflow validates that Pages is configured with exactly this domain before deploying. The `CNAME` file is copied into the static build, but Actions publishing also requires the custom domain in repository Settings → Pages.

DNS and HTTPS certificate changes can take up to 24 hours. Both the apex domain and `www` should reach the site, with `www` redirecting to the apex. This configuration applies only to Math Videos; do not change the personal site's domain settings.

## Maintenance

Renew the domain manually through Dynadot before November 1, 2027. GitHub Pages hosting is free for this public repository; no paid website-builder plan, API, or backend is required.

If changing domains, update repository Pages settings, `CNAME`, the workflow's `EXPECTED_DOMAIN`, DNS, and these documents together.

Official references:

- [Custom domains and DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
