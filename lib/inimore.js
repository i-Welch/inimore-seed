import h from "hyperscript";

export default function inimore(tagName, attributes, ...children) {
	const ele = h(tagName,
		children,
		attributes
	);

	return ele;
}