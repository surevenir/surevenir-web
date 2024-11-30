// custom.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "df-messenger": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
