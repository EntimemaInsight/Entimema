export default function ResourceSemanticText({ text, emphasis, className }: { text: string; emphasis?: string; className: string }) {
  if (!emphasis) return text;

  const emphasisStart = text.indexOf(emphasis);
  if (emphasisStart < 0) throw new Error(`Resource emphasis phrase "${emphasis}" is not present in "${text}".`);

  return <>{text.slice(0, emphasisStart)}<span className={className}>{emphasis}</span>{text.slice(emphasisStart + emphasis.length)}</>;
}
