# mathematicsvideos.org

Domain purchased through Dynadot. This guide records the DNS and GitHub Pages configuration for the standalone Math Videos website.

## After purchasing the domain

1. In GitHub account Settings → Pages, add and verify `mathematicsvideos.org`. GitHub provides the ownership-verification TXT record; add it in the registrar's DNS settings and retain it after verification.
2. In **BenjaminYazdi/math-videos → Settings → Pages**, enable GitHub Actions publishing and set **Custom domain** to `mathematicsvideos.org`. This setting applies only to the new repository. Do not edit the personal site's Pages settings.
3. In the new domain's Dynadot DNS settings, replace its parking/website records as needed with these GitHub Pages records:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | benjaminyazdi.github.io |

The `www` CNAME target is the account hostname only. It must not contain `/math-videos`. The separate custom domain is what routes this site independently; this does not replace `benjaminyazdi.com`.

4. In repository **Settings → Secrets and variables → Actions → Variables**, add `PUBLISH_SITE` with value `true`. This is a non-secret deployment switch.
5. Run **Check and deploy Math Videos** in Actions. The deployment verifies that the Pages custom-domain setting is exactly `mathematicsvideos.org` before publishing.
6. In repository Pages settings, enable **Enforce HTTPS** once GitHub has provisioned the certificate. DNS and certificate setup can take up to 24 hours. Visit both the apex domain and `www` to confirm that both reach the site.

The source `CNAME` file is an editable record of the intended domain and is copied into the static build. Because this project deploys through GitHub Actions, that file alone does not configure GitHub's custom-domain setting.

GitHub Pages hosting is available on GitHub Free for public repositories. Domain registration/renewal is separate. The site needs no paid API, backend, or Dynadot website subscription.

Checked against GitHub's official documentation on November 1, 2026:

- [Custom domains and DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
