module.exports = () => {
    /**
    * @type {import('next').NextConfig}
    */
    const nextConfig = {
        reactStrictMode: true,
    }

    const headers = () => {
        return [
            {
                source: '/:path*',
                headers: [
                    // informs browser to access site through HTTPS instead of HTTP
                    // all subdomains will use HTTPS for a max of 2 years
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },

                    // mostly for older web broesers that dont support CSP
                    // detect reflected XSS
                    // '1; mode=block' will prevent the page from rendering if reflected XSS is detected
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },

                    // deny loading of all <iframe>, <frame>, <embed>, <obkect>, e.g. <iframe src="./"></iframe>
                    // value: DENY / SAMEORIGIN
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },

                    // prevent content/MIME sniffing - inspecting byte stream to deduce the file format
                    // Web browsers does MIME sniffing if, web sites do not correctly signal the MIME type
                    // Attackers can confuse the MIME sniffing algorithm, to execute codes
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },

                    {
                        "key": "Content-Security-Policy",
                        "value": "default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self';"
                    }
                ]
            }
        ]
    }

    return {
        nextConfig,
        headers,
    }
}