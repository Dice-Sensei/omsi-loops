import { createMemo, JSX, splitProps, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import cx from 'clsx';

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
}

export const Icon = (props: IconProps) => {
  const [iconProps, svgProps] = splitProps(props, ['name']);
  const Icon = createMemo(() => icons[iconProps.name]);

  return <Dynamic component={Icon()} class={cx('w-full h-full', props.class)} {...svgProps} />;
};

const XSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M6 6L18 18M6 18L18 6'
      stroke='currentColor'
      stroke-width='2'
    />
  </svg>
);

const ChevronDownSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M6 9L12 15L18 9'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ChevronUpSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M6 15L12 9L18 15'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ChevronLeftSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M15 6L9 12L15 18'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ChevronRightSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M9 6L15 12L9 18'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ArrowDownSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M12 4L12 20M12 20L6 14M12 20L18 14'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ArrowUpSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M12 20L12 4M12 4L6 10M12 4L18 10'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ArrowLeftSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M20 12L4 12M4 12L10 6M4 12L10 18'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ArrowRightSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M4 12L20 12M20 12L14 6M20 12L14 18'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
  </svg>
);

const ExclamationTriangleSvg = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
      stroke='currentColor'
      stroke-width='2'
      fill='none'
    />
    <path d='M12 9v4' stroke='currentColor' stroke-width='2' stroke-linecap='round' />
    <circle cx='12' cy='17' r='1' fill='currentColor' />
  </svg>
);

const icons = {
  close: XSvg,
  chevronDown: ChevronDownSvg,
  chevronUp: ChevronUpSvg,
  chevronLeft: ChevronLeftSvg,
  chevronRight: ChevronRightSvg,
  arrowDown: ArrowDownSvg,
  arrowUp: ArrowUpSvg,
  arrowLeft: ArrowLeftSvg,
  arrowRight: ArrowRightSvg,
  warning: ExclamationTriangleSvg,
} satisfies Record<string, ValidComponent>;

export type IconName = keyof typeof icons;
