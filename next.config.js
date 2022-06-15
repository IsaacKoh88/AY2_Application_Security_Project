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

