import * as React from "../lib/react";

export const b = (onClick: () => void) => 
<button onclick={() => onClick()}>
click me
</button>