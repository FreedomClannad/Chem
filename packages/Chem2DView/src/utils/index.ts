export function SvgTransformUrl(dom: HTMLElement) {
	const svg = dom.querySelector("svg");

	if (!svg) return "";
	const clone_svg = svg.cloneNode(true) as SVGElement;
	clone_svg.setAttribute("style", "background-color: white;");
	const text = new XMLSerializer().serializeToString(clone_svg);
	const blob = new Blob([text], { type: "image/svg+xml" });
	return URL.createObjectURL(blob);
}
