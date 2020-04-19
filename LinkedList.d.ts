declare class LinkedList<V>
{
	first: LinkedList.Node<V> | undefined;
	last: LinkedList.Node<V> | undefined;
	previous: LinkedList.Node<V> | undefined;
	circular: boolean;

	constructor(iterable?: Iterable<V>, options?: { circular: boolean; });

	get size(): number;
	set size(val: number);
	get length(): number;
	set length(val: number);

	get start(): LinkedList.Node<V> | undefined;
	set start(val: LinkedList.Node<V> | undefined);
	get end(): LinkedList.Node<V> | undefined;
	set end(val: LinkedList.Node<V> | undefined);

	at(idx: number): V | undefined;
	elementAt(idx: number): V | undefined;
	nodeAt(idx: number): LinkedList.Node<V> | undefined;

	get(idx: number): V | undefined;
	set(idx: number, value: any): LinkedList.Node<V> | undefined;

	push(...val: V[]): LinkedList.Node<V>[] | LinkedList.Node<V> | undefined;
	pushList(list: V[]): void;
	peek(): V | undefined;
	pop(amount?: number): V[] | V | undefined;
	shift(amount?: number): V[] | V | undefined;

	append(...val: any): LinkedList.Node<V>[] | LinkedList.Node<V> | undefined;
	appendList(list: any): void;
	prepend(...val: any): LinkedList.Node<V>[] | LinkedList.Node<V> | undefined;
	prependList(list: any): void;

	reverse(): LinkedList<V>;
	toArray(): V[];
	clone(): LinkedList<V>;

	[Symbol.iterator](): IterableIterator<V>;
}

declare namespace LinkedList
{
	class Node<V>
	{
		value: V;
		previous: Node<V> | undefined;
		next: Node<V> | undefined;
		list: LinkedList<V> | undefined;
		constructor(value: any, list?: LinkedList<V>);

		prepend(node: Node<V> | V): Node<V>;
		append(node: Node<V> | V): Node<V>;
		remove(): void;

		static nodeOf<V>(data: V): Node<V>;
	}
}

export = LinkedList;
