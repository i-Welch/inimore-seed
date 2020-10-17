import { GetByKey1, GetByKey2, GetByKey3, GetByKey4, GetNonNullable1, GetNonNullable2, GetNonNullable3, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface ISet<Data, ReturnType> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		K4 extends keyof GetNonNullable3<Data, K1, K2, K3>
	>(
		path: [K1?, K2?, K3?, K4?] & [K1, K2, K3, K4],
		value: GetByKey4<Data, K1, K2, K3, K4>
	): ReturnType;

	(path: never[], value: Data): ReturnType;
	<K1 extends keyof Data>(path: [K1], value: GetByKey1<Data, K1>): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(path: [K1, K2], value: GetByKey2<Data, K1, K2>): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(path: [K1, K2, K3], value: GetByKey3<Data, K1, K2, K3>): ReturnType;

	// Note: Escape hatch
	// The idea is to make a developer work a little harder if they want to use it
	// to discourage them from doing so (and maybe update the store interface instead)
	// In some cases there's no way to known what path is being used though.
	// if a developer wants to use the escape hatch, they can do it like so:
	// ******
	// const value: myType = {};
	// store.set<Typing.off, myType>([...], value);
	// **** OR
	// store.set<Typing.off, any>([...], value);
	<
		T extends ETyping = ETyping.on,
		R = never
	>(
		path: T extends ETyping.off ? Path : never,
		value: T extends ETyping.off ? R : never
	): ReturnType;
}

