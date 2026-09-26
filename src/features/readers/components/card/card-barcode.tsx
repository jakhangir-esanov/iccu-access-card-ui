import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

const BARCODE_FORMAT = 'CODE128';
const BAR_WIDTH = 2;
const BAR_HEIGHT = 80;
const PIXEL_UNIT = /px$/;

function fitToBox(svg: SVGSVGElement): void {
  const width = svg.getAttribute('width')?.replace(PIXEL_UNIT, '') ?? '';
  const height = svg.getAttribute('height')?.replace(PIXEL_UNIT, '') ?? '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.removeAttribute('width');
  svg.removeAttribute('height');
}

export function CardBarcode({
  value,
  className,
}: {
  readonly value: string;
  readonly className: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg === null) {
      return;
    }
    JsBarcode(svg, value, {
      format: BARCODE_FORMAT,
      width: BAR_WIDTH,
      height: BAR_HEIGHT,
      margin: 0,
      displayValue: false,
      background: 'transparent',
    });
    fitToBox(svg);
  }, [value]);

  return (
    <svg
      ref={svgRef}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label={value}
    />
  );
}
