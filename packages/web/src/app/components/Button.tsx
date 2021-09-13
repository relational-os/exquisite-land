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
          font-size: 16px;
          font-weight: bold;
          font-family: inherit;
          letter-spacing: -1px;
          border-radius: 16px;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: gray;
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
