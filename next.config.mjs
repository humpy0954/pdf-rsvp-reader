/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Prevent webpack from trying to bundle the pdf worker
    config.resolve.alias["pdfjs-dist/build/pdf.worker.mjs"] = false;
    config.resolve.alias["pdfjs-dist/build/pdf.worker.min.mjs"] = false;
    return config;
  },
};

export default nextConfig;
