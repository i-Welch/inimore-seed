import { main } from "./components/main";
import preset from "jss-preset-default";
import jss from "jss";
import { BehaviorSubject } from "rxjs";
import { b } from "./components/button";

jss.setup(preset());

const name$ = new BehaviorSubject("Isaac");

name$.subscribe((name) => {
	const color = "#" + Math.round(Math.random() * 16).toString(16) + Math.round(Math.random() * 16).toString(16) + Math.round(Math.random() * 16).toString(16) + Math.round(Math.random() * 16).toString(16) + Math.round(Math.random() * 16).toString(16) + Math.round(Math.random() * 16).toString(16);
	const stylesheet = jss
	.createStyleSheet(
		{
			content: {
				"background-color": color,
				"color": "white"
			}
		}
	)
	.attach();

	document.body.appendChild(main(stylesheet.classes, name));
})

document.body.appendChild(b(() => {console.log("hello"); name$.next("Shane")}));
