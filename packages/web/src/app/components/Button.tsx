import React from 'react';

const Button = React.forwardRef(function Button(
  props: React.ComponentPropsWithoutRef<'button'>,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <>
      <button ref={ref} {...props} className={`button ${props.className}`} />
      <style jsx>{`
        .button {
          padding: 8px 16px;
          border: 0;
          background: #989898;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: #000;
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        .button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
});

export const ButtonSuccess = React.forwardRef(function ButtonSuccess(
  props: React.ComponentPropsWithoutRef<'button'>,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Button
      ref={ref}
      {...props}
      style={{
        color: '#000',
        background: '#62c64c'
      }}
    />
  );
});

export default Button;
