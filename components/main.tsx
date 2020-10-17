export const main = (
	styles: { content: string },
	content: string
): Element => 
	<div className={styles.content}>
		Yo :) - { content }
	</div>;
