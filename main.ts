import preset from "jss-preset-default";
import jss from "jss";
import { BehaviorSubject } from "rxjs";

import { main } from "./components/main";
import { b } from "./components/button";

jss.setup(preset());

const name$ = new BehaviorSubject("Isaac");

name$.subscribe((name) => {
	const color = [0, 0, 0, 0 ,0 ,0].map(() => Math.round(Math.random() * 15).toString(16));
	const stylesheet = jss
		.createStyleSheet(
			{
				content: {
					"background-color": "#" + color.join(""),
					"color": "white"
				}
			}
		)
		.attach();

	document.body.appendChild(main(stylesheet.classes, name));
});

document.body.appendChild(b(() => { name$.next("Shane"); }));
