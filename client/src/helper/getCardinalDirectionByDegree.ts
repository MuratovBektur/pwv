import weatherDirections from "./weatherDirections";

export default function (deg: number): string | never {
  if (deg === 0) deg = 360;
  if (deg < 0 || deg > 360)
    throw "degree must be between 0 and 360 (inclusive)";
  for (let i = 0; i < weatherDirections.length; i++) {
    const direction = weatherDirections[i];
    const name = direction[0];
    const min = direction[1];
    const max = direction[2];
    // prettier-ignore
    if (i === 0 && (
      (deg <= 360 && deg > min) || 
      (deg > 0 && deg <= max)
      )
    ) {
      return name;
    } else if (deg > min && deg <= max) {
      return name;
    }
  }
  throw "can't find directions";
}
