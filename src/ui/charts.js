function buildPath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function buildAreaPath(points, width, height, baselineY) {
  if (!points.length) {
    return '';
  }
  const line = buildPath(points);
  return `${line} L ${width - 12} ${baselineY} L 12 ${baselineY} Z`;
}

export function renderWinRateChart(series, currentIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chart-shell';

  if (!series.length) {
    wrapper.textContent = '評価推移を描けるだけの履歴がありません。';
    return wrapper;
  }

  const width = 320;
  const height = 124;
  const padding = 12;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const baselineY = padding + innerHeight / 2;

  const points = series.map((entry, index) => ({
    x: padding + (series.length === 1 ? innerWidth / 2 : (innerWidth * index) / (series.length - 1)),
    y: padding + (1 - entry.blackWinRate) * innerHeight,
    entry,
  }));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'timeline-chart');

  const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  baseline.setAttribute('x1', String(padding));
  baseline.setAttribute('x2', String(width - padding));
  baseline.setAttribute('y1', String(baselineY));
  baseline.setAttribute('y2', String(baselineY));
  baseline.setAttribute('class', 'timeline-baseline');
  svg.appendChild(baseline);

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', buildAreaPath(points, width, height, height - padding));
  area.setAttribute('class', 'timeline-area');
  svg.appendChild(area);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', buildPath(points));
  line.setAttribute('class', 'timeline-line');
  svg.appendChild(line);

  points.forEach((point, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(point.x));
    circle.setAttribute('cy', String(point.y));
    circle.setAttribute('r', index === currentIndex ? '4.5' : '2.6');
    circle.setAttribute('class', index === currentIndex ? 'timeline-dot current' : 'timeline-dot');
    svg.appendChild(circle);
  });

  wrapper.appendChild(svg);
  return wrapper;
}
