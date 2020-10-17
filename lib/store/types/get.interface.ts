import { Observable } from "rxjs";
import { ETyping } from "./typing.enum";

export interface IGet<Data> {
	// placing it at the top and "[K1?, K2?, K3?, K4?] & [K1, K2, K3, K4]" trick adds autocomplete
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		K4 extends keyof GetNonNullable3<Data, K1, K2, K3>
	>(path: [K1?, K2?, K3?, K4?] & [K1, K2, K3, K4]): Observable<GetByKey4<Data, K1, K2, K3, K4>>;

	(path: never[]): Observable<Data>;
	<K1 extends keyof Data>(path: [K1]): Observable<GetByKey1<Data, K1>>;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(path: [K1, K2]): Observable<GetByKey2<Data, K1, K2>>;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(path: [K1, K2, K3]): Observable<GetByKey3<Data, K1, K2, K3>>;

	// NOTE: escape hatch
	<
		T extends ETyping = ETyping.on,
		R = never
	>(path: T extends ETyping.off ? Path : never): Observable<T extends ETyping.off ? R : never>;
}

export type Key = string | number | symbol;
export type Path = Key[];
type Nullable<T> = Exclude<T, NonNullable<T>>;

// Get Safe types
export type GetByKey1<T, K1> = K1 extends keyof T ? T[K1] : never;

export type GetByKey2<T, K1, K2> = K1 extends keyof T
	? K2 extends keyof GetNonNullable1<T, K1>
		? GetNonNullable1<T, K1>[K2] | Nullable<GetByKey1<T, K1>>
		: never
	: never;

export type GetByKey3<T, K1, K2, K3> = K1 extends keyof T
	? K2 extends keyof GetNonNullable1<T, K1>
		? K3 extends keyof GetNonNullable2<T, K1, K2>
			? GetNonNullable2<T, K1, K2>[K3] | Nullable<GetByKey2<T, K1, K2>>
			: never
		: never
	: never;

export type GetByKey4<T, K1, K2, K3, K4> = K1 extends keyof T
	? K2 extends keyof GetNonNullable1<T, K1>
		? K3 extends keyof GetNonNullable2<T, K1, K2>
			? K4 extends keyof GetNonNullable3<T, K1, K2, K3>
				? GetNonNullable3<T, K1, K2, K3>[K4] | Nullable<GetByKey3<T, K1, K2, K3>>
				: never
			: never
		: never
	: never;

export type GetNonNullable1<T, K1> = NonNullable<GetByKey1<T, K1>>;
export type GetNonNullable2<T, K1, K2> = NonNullable<GetByKey2<T, K1, K2>>;
export type GetNonNullable3<T, K1, K2, K3> = NonNullable<GetByKey3<T, K1, K2, K3>>;
export type GetNonNullable4<T, K1, K2, K3, K4> = NonNullable<GetByKey4<T, K1, K2, K3, K4>>;
