import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/:path*", // Proxy to Backend
			},
		];
	},
};

export default nextConfig;
