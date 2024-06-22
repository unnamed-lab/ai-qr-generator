const GradientWrapper = ({ children, ...props }: any) => (
  <div
    {...props}
    className={`relative my-16 overflow-hidden border-t sm:my-28 ${
      props.className || ""
    }`}
  > <div className="absolute inset-0 h-full w-full blur-[100px]" style={{ background:
          "linear-gradient(202.72deg, rgba(237, 78, 80, 0.05) 14.76%, rgba(152, 103, 240, 0.04) 34.37%, rgba(152, 103, 240, 0) 86.62%)",
      }}
    /> <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
