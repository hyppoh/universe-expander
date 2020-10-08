function primesLTE(x) {
	x = new OmegaNum(x).round();
	if (x.lte(1)) return new OmegaNum(0);
	if (x.lte(11))
		return OmegaNum.mul(2.7135e-158, OmegaNum.pow(2.116e14, x))
			.sub(x.pow(2).times(0.053030303))
			.plus(x.times(1.02576))
			.sub(0.9)
			.round();
	let ret = x.div(x.ln());
	return ret.round();
}