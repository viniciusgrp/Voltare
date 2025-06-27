// place files you want to import through the `$lib` alias in this folder.

export async function fetchAge(name) {
	if (!name) return null;
	try {
		const res = await fetch(`https://api.agify.io?name=${encodeURIComponent(name)}`);
		if (res.ok) {
			return await res.json();
		} else {
			return { name };
		}
	} catch {
		return { name };
	}
}