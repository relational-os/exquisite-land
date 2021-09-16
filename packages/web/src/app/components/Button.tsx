import React from "react";

const Button = React.forwardRef(function Button(
	props: React.ComponentPropsWithoutRef<"button">,
	ref: React.Ref<HTMLButtonElement>
) {
	return (
		<>
			<button ref={ref} {...props} className={`button ${props.className}`} />
			<style jsx>{`
				.button {
					padding: 8px 12px;
					border: 0;
					background: hsl(0deg 0% 90%);
					font-size: 24px;
					font-family: inherit;
					cursor: pointer;
					will-change: transform;
					transition: transform 0.2s ease-in-out;
					color: gray;
					border-bottom: 4px solid rgba(0, 0, 0, 0.3);
				}

				.button:hover {
					transform: scale(1.05);
				}
			`}</style>
		</>
	);
});

export const ButtonSuccess = React.forwardRef(function ButtonSuccess(
	props: React.ComponentPropsWithoutRef<"button">,
	ref: React.Ref<HTMLButtonElement>
) {
	return (
		<Button
			ref={ref}
			{...props}
			style={{
				color: "hsl(173deg 58% 20%)",
				background: "hsl(173deg 58% 80%)",
			}}
		/>
	);
});

export default Button;
