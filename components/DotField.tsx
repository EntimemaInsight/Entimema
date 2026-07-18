const orangeDots = [
  [8.5, 1.2], [80.5, 1.5], [96.8, 1.2], [3.8, 13.5], [27.2, 12.2],
  [35.5, 9.3], [48.8, 12.8], [93.2, 21.5], [98.5, 37.1], [2.1, 83.5],
  [41.8, 87.1], [52.1, 94.2], [93.8, 95.7], [33.7, 99.1], [86.2, 99.1],
];

export default function DotField() {
  return (
    <div className="dot-field" aria-hidden="true">
      <div className="dot-field__blue" />
      <div className="dot-field__orange">
        {orangeDots.map(([left, top], index) => (
          <i key={index} style={{ left: `${left}%`, top: `${top}%` }} />
        ))}
      </div>
    </div>
  );
}
