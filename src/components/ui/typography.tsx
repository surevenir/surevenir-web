export function TypographyH1({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h1 className="scroll-m-20 font-extrabold text-4xl lg:text-5xl tracking-tight">
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="scroll-m-20 first:mt-0 pb-2 font-semibold text-3xl tracking-tight">
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h4 className="scroll-m-20 font-semibold text-xl tracking-tight">
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <p className="[&:not(:first-child)]:mt-6 leading-7">{children}</p>;
}

export function TypographyBlockquote({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <blockquote className="mt-6 pl-6 border-l-2 italic">{children}</blockquote>
  );
}

export function TypographyLarge({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="font-semibold text-lg">{children}</div>;
}

export function TypographySmall({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <small className="font-medium text-sm leading-none">{children}</small>;
}

export function TypographyMuted({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}
