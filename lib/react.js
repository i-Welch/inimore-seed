import h from "hyperscript";

export function createElement(tagName, attributes, ...children) {
	console.log(attributes)
	const ele = h(tagName,
		children,
		attributes
	);

	return ele;
}