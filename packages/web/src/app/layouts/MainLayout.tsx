import Header from "@app/components/Header";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="main-layout">
			<header>
				<Header />
			</header>
			{children}
			<style jsx>{`
				.main-layout {
				}
				header {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 100;
				}
			`}</style>
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");
				* {
					box-sizing: border-box;
				}
				html,
				body {
					font-size: 16px;
					font-family: "VT323", monospace;
					margin: 0;
					padding: 0;
				}
			`}</style>
		</div>
	);
};

export default MainLayout;
