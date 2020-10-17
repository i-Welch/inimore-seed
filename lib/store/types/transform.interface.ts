import { GetByKey1, GetByKey2, GetByKey3, GetByKey4, GetNonNullable1, GetNonNullable2, GetNonNullable3, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface ITransform<Data, ReturnType> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		K4 extends keyof GetNonNullable3<Data, K1, K2, K3>
	>(
		path: [K1, K2, K3, K4] & [K1?, K2?, K3?, K4?],
		transformer: (value: GetByKey4<Data, K1, K2, K3, K4>) =>
			GetByKey4<Data, K1, K2, K3, K4>): ReturnType;

	(path: never[], transformer: (value: Data) => Data): ReturnType;
	<K1 extends keyof Data>(
		path: [K1],
		transformer: (value: GetByKey1<Data, K1>) =>
			GetByKey1<Data, K1>): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(
		path: [K1, K2],
		transformer: (value: GetByKey2<Data, K1, K2>) =>
			GetByKey2<Data, K1, K2>): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(
		path: [K1, K2, K3],
		transformer: (value: GetByKey3<Data, K1, K2, K3>) =>
			GetByKey3<Data, K1, K2, K3>): ReturnType;
	// Note: Escape hatch
	<
		T extends ETyping = ETyping.on,
		R = never
	>(
		path: T extends ETyping.off ? Path : never,
		transformer: (value: T extends ETyping.off ? R : never) => T extends ETyping.off ? R : never
	): ReturnType;
}
