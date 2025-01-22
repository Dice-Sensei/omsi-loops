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

const icons = {
  close: XSvg,
} satisfies Record<string, ValidComponent>;

export type IconName = keyof typeof icons;
