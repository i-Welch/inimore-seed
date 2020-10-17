import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, first, map, switchMap, tap } from "rxjs/operators";
import { getSafe, IStoreBatchTyped, StoreBatch } from "./store-batch";
import { IDelete } from "./types/delete.interface";
import { IExtend } from "./types/extend.interface";
import { IGetFromStore } from "./types/get-from-store.inteface";
import { IGetSync } from "./types/get-sync.interface";
import { Path } from "./types/get.interface";
import { IGet } from "./types/get.interface";
import { ISet } from "./types/set.interface";
import { ITransform } from "./types/transform.interface";

// ** deprecated;
export interface IBatchSetInfo {
	path: Path;
	// tslint:disable-next-line:no-any
	value: any;
}

export interface IStoreTyped<Data extends object> {
	getSync: IGetSync<Data>;
	get: IGet<Data>;
	set: ISet<Data, void>;
	delete: IDelete<Data, void>;
	transform: ITransform<Data, void>;
	extend: IExtend<Data, void>;
	batch: () => IStoreBatchTyped<Data>;
	getFromStore: IGetFromStore<Data>;
}

export class StoreUtility<TData extends object> implements IStoreTyped<TData> {
	private data$: BehaviorSubject<TData>;

	private constructor(initialData: TData) {
		this.data$ = new BehaviorSubject(initialData);
	}

	// static method "create" & private constructor to enforce IStoreTyped type and typesafety for users
	public static create<T extends object>(initialData: T): IStoreTyped<T> {
		return new StoreUtility(initialData);
	}

	public getSync<T>(path: Path): T {
		return getSafe<T>(path, this.data$.value);
	}

	public get<T>(path: Path): Observable<T> {
		return this.data$.pipe(
			map((data) => getSafe<T>(path, data)),
			distinctUntilChanged()
		);
	}

	public batch(): StoreBatch<TData> {
		return new StoreBatch(this.data$);
	}

	public set(path: Path, value: unknown): void {
		this.batch().set(path, value).commit();
	}

	public delete(path: Path): void {
		this.batch().delete(path).commit();
	}

	// // e.g storeService.transform(["count"], (count) => {return count + 1})
	// // NOTE: don't forget to make a shallow copy when you return an object
	public transform<T>(path: Path, transformer: (data: T) => T): void {
		this.batch().transform(path, transformer).commit();
	}

	public extend<T extends object>(path: Path, updates: Partial<T>): void {
		this.batch().extend(path, updates).commit();
	}

	public getFromStore<T>(path: Path, getData: () => Observable<T>): Observable<T> {
		const value = this.getSync<T>(path);
		return value
			? this.get<T>(path)
			: this.getDataAndSet(path, getData).pipe(
				switchMap(() => this.get<T>(path))
			);
	}

	private getDataAndSet<T>(
		path: Path,
		getData: () => Observable<T>
	): Observable<T> {
		const data$ = getData().pipe(
			first(),
			tap((data) => {
				this.set(path, data);
			})
		);
		return data$;
	}
}
