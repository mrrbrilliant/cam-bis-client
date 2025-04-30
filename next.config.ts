import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				// Use environment variable for backend URL, default to localhost:4000
				// preiiter
				destination: `${process.env.BACKEND_URL}/:path*`,
			},
		];
	},
	output: "standalone",
};

export default nextConfig;
