export default function closestPowerOf2(goal) {
	const powers = [4, 16, 64, 256, 1024]
	const result = powers.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
	if (result < goal) {
		return Math.sqrt(powers[powers.indexOf(result) + 1])
	}
	return Math.sqrt(result)
}