export function includesAll<T>( arr: T[], subset: T[] ) {
	let flag = 0;
	subset.forEach( entry => {
		if ( arr.includes( entry ) ) {
			flag++;
		}
	} );
	return subset.length === flag;
}

export function includesSome<T>( arr: T[], subset: T[] ) {
	let flag = 0;
	subset.forEach( entry => {
		if ( arr.includes( entry ) ) {
			flag++;
		}
	} );

	return flag > 0;
}

export function removeIfPresent<T>( arr: T[], subset: T[] ) {
	const newArr: T[] = [];
	subset.forEach( entry => {
		if ( !arr.includes( entry ) ) {
			newArr.push( entry );
		}
	} );
	return newArr;
}

export function shuffle<T>( array: T[] ) {
	let arr = [ ...array ];
	for ( let i = arr.length; i > 1; i-- ) {
		let j = Math.floor( Math.random() * i );
		[ arr[ i - 1 ], arr[ j ] ] = [ arr[ j ], arr[ i - 1 ] ];
	}
	return arr;
}

export function splitArray<T>( arr: T[] ) {
	return [ arr.slice( 0, arr.length / 2 ), arr.slice( arr.length / 2 ) ];
}