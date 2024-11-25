import clsx from "clsx";

export function TypographyH1({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <h1
      className={clsx(
        "scroll-m-20 font-extrabold text-4xl text-primary lg:text-5xl dark:text-white tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <h2
      className={clsx(
        "scroll-m-20 first:mt-0 pb-2 font-semibold text-3xl text-primary dark:text-white tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <h3
      className={clsx(
        "scroll-m-20 font-semibold text-2xl text-primary dark:text-white tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <h4
      className={clsx(
        "scroll-m-20 font-semibold text-primary text-xl dark:text-white tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <p className={clsx("[&:not(:first-child)]:mt-6 leading-7", className)}>
      {children}
    </p>
  );
}

export function TypographyBlockquote({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <blockquote className={clsx("mt-6 pl-6 border-l-2 italic", className)}>
      {children}
    </blockquote>
  );
}

export function TypographyLarge({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className={clsx("font-semibold text-lg", className)}>{children}</div>
  );
}

export function TypographySmall({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <small className={clsx("font-medium text-sm leading-none", className)}>
      {children}
    </small>
  );
}

export function TypographyMuted({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <p className={clsx("text-muted-foreground text-sm", className)}>
      {children}
    </p>
  );
}
