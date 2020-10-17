import { GetByKey1, GetByKey2, GetByKey3, GetNonNullable1, GetNonNullable2, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface IExtend<Data, ReturnType> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(path: [K1?, K2?, K3?] & [K1, K2, K3], updates: GetObjectPartial<GetByKey3<Data, K1, K2, K3>>): ReturnType;

	(path: never[], updates: Partial<Data>): ReturnType;

	<K1 extends keyof Data>(path: [K1], updates: GetObjectPartial<GetByKey1<Data, K1>>): ReturnType;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(path: [K1, K2], updates: GetObjectPartial<GetByKey2<Data, K1, K2>>): ReturnType;

	// Note: Escape hatch
	<
		T extends ETyping = ETyping.on,
		R extends object = never
	>(
		path: T extends ETyping.off ? Path : never,
		updates: T extends ETyping.off ? GetObjectPartial<R> : never
	): ReturnType;
}

type GetObjects<T> = Extract<T, object>;
type GetObjectPartial<T> = Partial<GetObjects<T>>;
