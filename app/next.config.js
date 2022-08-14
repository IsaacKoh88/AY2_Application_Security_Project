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
                        "value": "default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self'; font-src 'self';\
                         style-src 'self' 'sha256-4/2nIlfwIVTJ1+JcNQ6LkeVWzNS148LKAJeL5yofdN4=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-17bm4kyfqQSAZqk3Q+0lFlkHTnSGpOoBSvtppRZq1AM=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-l5/ETC5uucCzv8WRWkDG6N1Br2Hnhib+jMX0smfAeS8=' 'sha256-x9xBo8vA8uMXU3yjSQdQY2obHev3Cdd9Sw9YotHDZGU=' 'sha256-MmexY5TvGETQJqrtJ6f8kSEYdd+y7gus2NY+YHH5/vM='\
                         'sha256-Xhk1rMtpnLuhjAw8UNPGzuSTildNUS9rPgYeADF5xQM=' 'sha256-rOkfNP+Pcm0pog2/fsDp0vtd2DAdrSpsGpomAp3sIB8=';"
                    }
                ]
            }
        ]
    }

    const typescript = {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    }

    return {
        nextConfig,
        headers,
        typescript
    }
}