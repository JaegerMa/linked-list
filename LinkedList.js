'use strict';

const size = Symbol();
const prependToNode = Symbol();
const createInitialNode = Symbol();
const appendToNode = Symbol();
const removeNode = Symbol();

class LinkedList
{
	/* Attributes:
	- first: node
	- previous: node
	- size: int
	- circular: bool
	*/
	constructor(iterable, options)
	{
		if(arguments.length === 1 && iterable && !iterable[Symbol.iterator])
		{
			options = iterable;
			iterable = null;
		}
		if(!options)
			options = {};


		this[size] = 0;
		this.circular = options.circular || false;

		if(iterable && iterable[Symbol.iterator])
			this.appendList(iterable);
	}

	clone()
	{
		return new LinkedList(this, { circular: this.circular });
	}

	get size()
	{
		return this[size];
	}
	set size(val)
	{
		while(this.size > val)
			this.pop();
	}
	get length()
	{
		return this.size;
	}
	set length(val)
	{
		this.size = val;
	}

	get start()
	{
		return this.first;
	}
	set start(val)
	{
		this.first = val;
	}
	get end()
	{
		return this.last;
	}
	set end(val)
	{
		this.last = val;
	}

	at(idx)
	{
		return this.elementAt(idx);
	}
	elementAt(idx)
	{
		let node = this.nodeAt(idx);
		if(!node)
			return;

		return node.value;
	}
	nodeAt(idx)
	{
		if(idx < 0)
			return;

		let node = this.first;
		for(let i = 0; i < idx && node; ++i)
			node = node.next;

		return node;
	}

	get(idx)
	{
		return this.elementAt(idx);
	}
	set(idx, value)
	{
		let node = this.nodeAt(idx);
		if(!node)
		{
			while(idx + 1 < this.size)
				node = this.push(undefined);
		}

		node.value = value;
		return node;
	}

	push(val)
	{
		return this.append(...arguments);
	}
	pushList(list)
	{
		return this.appendList(list);
	}
	peek()
	{
		let last = this.last;
		if(!last)
			return;

		return last.value;
	}
	pop(amount = 1)
	{
		let popped = [];
		for(let i = 0; i < amount; ++i)
		{
			let last = this.last;
			if(!last)
				break;

			popped.push(last.value);
		}

		if(amount === 0)
			return undefined;
		if(amount === 1)
			return popped[0];

		return popped;
	}
	shift(amount = 1)
	{
		if(amount <= 0)
			return;

		let shifted = [];
		for(let i = 0; i < amount; ++i)
		{
			let first = this.first;
			if(!first)
				break;

			shifted.push(first.value);
			first.remove();
		}

		if(amount === 1)
			return shifted[0];

		return shifted;
	}

	append(val)
	{
		let nodes = [];
		for(let val of arguments)
		{
			let node;
			if(this.size === 0)
				node = this[createInitialNode](val);
			else
				node = this.last.append(val);

			this.last = node;
			nodes.push(node);
		}

		if(arguments.length === 0)
			return;
		if(arguments.length === 1)
			return nodes[0];

		return nodes;
	}
	appendList(list)
	{
		for(let element of list)
			this.append(element);
	}
	prepend(val)
	{
		let nodes = [];
		for(let val of arguments)
		{
			let node;
			if(this.size === 0)
				node = this[createInitialNode](val);
			else
				node = this.first.prepend(val);

			this.first = node;
			nodes.push(node);
		}

		if(arguments.length === 0)
			return;
		if(arguments.length === 1)
			return nodes[0];

		return nodes;
	}
	prependList(list)
	{
		let previous;
		for(let element of list)
		{
			if(!previous)
				previous = this.prepend(element);
			else
				previous = previous.append(element);
		}
	}

	reverse()
	{
		let reversed = new LinkedList({ circular: this.circular });
		for(let element of this)
			reversed.prepend(element);

		return reversed;
	}


	toArray()
	{
		return [...this];
	}
	*[Symbol.iterator]()
	{
		if(!this.first)
			return;


		let first = this.first;
		yield first.value;

		let node = first.next;
		while(node && node !== first)
		{
			yield node.value;
			node = node.next;
		}
	}


	[prependToNode](base, node)
	{
		if(!base || base.list !== this)
			return;

		node = Node.nodeOf(node);
		node.list = this;

		node.previous = base.previous;
		if(base.previous)
			base.previous.next = node;

		node.next = base;
		base.previous = node;

		++this[size];
		if(this.first === base)
			this.first = node;


		return node;
	}
	[appendToNode](base, node)
	{
		if(!base || base.list !== this)
			return;

		node = Node.nodeOf(node);
		node.list = this;

		node.next = base.next;
		if(base.next)
			base.next.previous = node;

		node.previous = base;
		base.next = node;

		++this[size];
		if(this.last === base)
			this.last = node;


		return node;
	}
	[removeNode](node)
	{
		if(!node || node.list !== this)
			return;

		const next = node.next;

		if(node.previous)
			node.previous.next = node.next;
		if(node.next)
			node.next.previous = node.previous;

		if(this.first === node)
			this.first = node.next;
		if(this.last === node)
			this.last = node.previous;

		node.previous = null;
		node.next = null;

		--this[size];


		return next;
	}

	[createInitialNode](val)
	{
		let node = new Node(val, this);
		if(this.circular)
		{
			node.next = node;
			node.previous = node;
		}

		this.first = node;
		this.last = node;

		this[size] = 1;

		return node;
	}
}
class Node
{
	/* Attributes
	- value
	- previous: Node
	- next: Node
	- list: LinkedList
	*/
	constructor(value, list)
	{
		this.value = value;
		this.list = list;
	}

	prepend(node)
	{
		return this.list && this.list[prependToNode](this, node);
	}
	append(node)
	{
		return this.list && this.list[appendToNode](this, node);
	}
	remove()
	{
		return this.list && this.list[removeNode](this);
	}


	static nodeOf(data)
	{
		if(data instanceof Node)
			return data;

		return new Node(data);
	}
}

LinkedList.Node = Node;
LinkedList.symbols =
{
	size,
	prependToNode,
	appendToNode,
	removeNode,
	createInitialNode,
};


if(typeof (module) === 'object')
	module.exports = LinkedList;
