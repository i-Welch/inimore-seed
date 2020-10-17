import { GetNonNullable1, GetNonNullable2, GetNonNullable3, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface IDelete<Data, ReturnType> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		K4 extends keyof GetNonNullable3<Data, K1, K2, K3>
	>(path: [K1?, K2?, K3?, K4?] & [K1, K2, K3, K4]): ReturnType;

	(path: never[]): ReturnType;
	<K1 extends keyof Data>(path: [K1]): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(path: [K1, K2]): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(path: [K1, K2, K3]): ReturnType;

	// Escape hatch
	<T extends ETyping = ETyping.on>(path: T extends ETyping.off ? Path : never): ReturnType;
}
