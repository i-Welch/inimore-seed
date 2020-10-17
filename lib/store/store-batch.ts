import { get } from "lodash/fp";
import { setWith, unset } from "lodash/fp";
import { BehaviorSubject } from "rxjs";
import { IDelete } from "./types/delete.interface";
import { IExtend } from "./types/extend.interface";
import { Path } from "./types/get.interface";
import { ISet } from "./types/set.interface";
import { ITransform } from "./types/transform.interface";

enum EActionType {
	delete = "detele",
	transform = "transform",
}

interface IDeleteAction {
	type: EActionType.delete;
	path: Path;
}

interface ITransformAction {
	type: EActionType.transform;
	path: Path;
	// tslint:disable-next-line: no-any
	transformer: (data: any) => any;
}

type BatchAction = ITransformAction | IDeleteAction;

export interface IStoreBatchTyped<Data extends object> {
	set: ISet<Data, IStoreBatchTyped<Data>>;
	transform: ITransform<Data, IStoreBatchTyped<Data>>;
	extend: IExtend<Data, IStoreBatchTyped<Data>>;
	delete: IDelete<Data, IStoreBatchTyped<Data>>;
	commit(): void;
}

export class StoreBatch<Y extends object> implements IStoreBatchTyped<Y> {
	private batch: BatchAction[] = [];

	constructor(private data$: BehaviorSubject<Y>) { }

	public set(path: Path, value: unknown): StoreBatch<Y> {
		this.transform(path, () => value);
		return this;
	}

	public transform<T>(path: Path, transformer: (data: T) => T): StoreBatch<Y> {
		this.batch.push({ type: EActionType.transform, path, transformer });
		return this;
	}

	public extend<T extends object>(path: Path, update: T): StoreBatch<Y> {
		this.transform<T>(path, (oldValue) => ({...oldValue, ...update}));
		return this;
	}

	public delete(path: Path): StoreBatch<Y> {
		this.batch.push({ type: EActionType.delete, path });
		return this;
	}

	public commit(): void {
		// apply batch actions
		const oldData = this.data$.value;

		const newData = this.batch.reduce((data, action) => {
			const {path}: BatchAction = action;
			switch (action.type) {
				case EActionType.delete:
					return path.length ? unset(path, data) : {};
				case EActionType.transform:
					const {transformer}: ITransformAction = action;
					const oldValue = getSafe(path, data);
					const newValue = transformer(oldValue);
					return path.length ? setWith(Object, path, newValue, data) : newValue;
				default:
					throw new Error(`The code doesn't handle this action type`);
			}
		}, oldData);

		// push data
		this.data$.next(newData);
		// reset batch
		this.batch = [];
	}
}

export function getSafe<R>(path: Path, obj: object): R {
	return path.length ? get(path, obj) : obj;
}
