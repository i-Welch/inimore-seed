import { DeepReadonly } from "@interfaces/deep-readonly.inteface";
import { GetByKey1, GetByKey2, GetByKey3, GetByKey4, GetNonNullable1, GetNonNullable2, GetNonNullable3, Path } from "./get.interface";
import { ETyping } from "./typing.enum";

export interface IGetSync<Data> {
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>,
		K4 extends keyof GetNonNullable3<Data, K1, K2, K3>
	>(path: [K1?, K2?, K3?, K4?] & [K1, K2, K3, K4]): DeepReadonly<GetByKey4<Data, K1, K2, K3, K4>>;

	(path: never[]): DeepReadonly<Data>;
	<K1 extends keyof Data>(path: [K1]): DeepReadonly<GetByKey1<Data, K1>>;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>
	>(path: [K1, K2]): DeepReadonly<GetByKey2<Data, K1, K2>>;
	<
		K1 extends keyof Data,
		K2 extends keyof GetNonNullable1<Data, K1>,
		K3 extends keyof GetNonNullable2<Data, K1, K2>
	>(path: [K1, K2, K3]): DeepReadonly<GetByKey3<Data, K1, K2, K3>>;

	// NOTE: escape hatch
	<
		T extends ETyping = ETyping.on,
		R = never
	>(path: T extends ETyping.off ? Path : never): T extends ETyping.off ? DeepReadonly<R> : never;
}
