<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sitemap xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="uk">
      <head>
        <meta charset="UTF-8"/>
        <title>Sitemap</title>
        <style type="text/css">
          body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; margin: 24px; color: #111; background: #fff; }
          h1 { font-size: 20px; margin: 0 0 16px; }
          p { color: #555; margin: 0 0 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 13px; }
          th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; vertical-align: top; }
          th { background: #f5f5f5; }
          a { color: #0b57d0; word-break: break-all; }
          .alt { color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>Lastmod</th>
              <th>Changefreq</th>
              <th>Priority</th>
              <th>Alternates</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td><xsl:value-of select="position()"/></td>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
                <td class="alt">
                  <xsl:for-each select="xhtml:link">
                    <div>
                      <xsl:value-of select="@hreflang"/>:
                      <a href="{@href}"><xsl:value-of select="@href"/></a>
                    </div>
                  </xsl:for-each>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
