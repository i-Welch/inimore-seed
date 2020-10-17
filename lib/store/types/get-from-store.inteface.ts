import { Observable } from "rxjs";
import { GetNonNullable1, GetNonNullable2, GetNonNullable3, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface IGetFromStore<Data> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		RData extends Observable<GetNonNullable3<Data, K1, K2, K3>>
	>(
		path: [K1?, K2?, K3?] & [K1, K2, K3],
		getData: () => RData
	): RData;

	(
		path: never[],
		getData: () => Observable<NonNullable<Data>>
	): Observable<NonNullable<Data>>;

	<
		K1 extends keyof Data,
		RData extends Observable<GetNonNullable1<Data, K1>>
	>(
		path: [K1],
		getData: () => RData
	): RData;

	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		RData extends Observable<GetNonNullable2<Data, K1, K2>>
	>(
		path: [K1, K2],
		getData: () => RData
	): RData;

	// NOTE: escape hatch
	<
		T extends ETyping = ETyping.on,
		R = never
	>(
		path: T extends ETyping.off ? Path : never,
		getData: () => Observable<R>
	): Observable<T extends ETyping.off ? R : never>;
}
