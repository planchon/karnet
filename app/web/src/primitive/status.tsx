export const Status = (props: { status: 'todo' | 'in_progress' | 'done' }) => {
  const todo = (
    <>
      <circle
        cx="7"
        cy="7"
        fill="none"
        r="6"
        stroke="lch(68.75% 3.577 260.65)"
        stroke-dasharray="1.4 1.74"
        stroke-dashoffset="0.65"
        stroke-width="1.5"
      />
      <circle
        className="progress"
        cx="7"
        cy="7"
        fill="none"
        r="2"
        stroke="lch(68.75% 3.577 260.65)"
        stroke-dasharray="11.309733552923255 22.61946710584651"
        stroke-dashoffset="11.309733552923255"
        stroke-width="4"
        transform="rotate(-90 7 7)"
      />
    </>
  );

  const inProgress = (
    <>
      <circle
        cx="7"
        cy="7"
        fill="none"
        r="6"
        stroke="lch(80% 90 85)"
        stroke-dasharray="3.14 0"
        stroke-dashoffset="-0.7"
        stroke-width="1.5"
      />
      <circle
        className="progress"
        cx="7"
        cy="7"
        fill="none"
        r="2"
        stroke="lch(80% 90 85)"
        stroke-dasharray="11.309733552923255 22.61946710584651"
        stroke-dashoffset="5.654866776461628"
        stroke-width="4"
        transform="rotate(-90 7 7)"
      />
    </>
  );

  const done = (
    <>
      <circle
        cx="7"
        cy="7"
        fill="none"
        r="6"
        stroke="lch(48% 59.31 288.43)"
        stroke-dasharray="3.14 0"
        stroke-dashoffset="-0.7"
        stroke-width="1.5"
      />
      <circle
        className="progress"
        cx="7"
        cy="7"
        fill="none"
        r="3"
        stroke="lch(48% 59.31 288.43)"
        stroke-dasharray="18.84955592153876 37.69911184307752"
        stroke-dashoffset="0"
        stroke-width="6"
        transform="rotate(-90 7 7)"
      />
      <path
        d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
        fill="lch(99 0 282.863)"
        stroke="none"
      />
    </>
  );

  return (
    <svg
      className="color-override transition-all duration-300"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      {props.status === 'done' && done}
      {props.status === 'in_progress' && inProgress}
      {props.status === 'todo' && todo}
    </svg>
  );
};
