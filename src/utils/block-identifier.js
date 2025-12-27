import { v4 as uuidv4 } from 'uuid';

/**
 * Get block path in the block tree
 * @param {string} clientId Block client ID
 * @param {Function} getBlocks Function to get all blocks
 * @returns {string} Block path (e.g., "0.2.1")
 */
function getBlockPath( clientId, getBlocks ) {
	const rootBlocks = getBlocks();
	const path = [];

	function findBlockPath( blocks, targetId, currentPath ) {
		for ( let i = 0; i < blocks.length; i++ ) {
			const block = blocks[ i ];
			const newPath = [ ...currentPath, i ];

			if ( block.clientId === targetId ) {
				return newPath;
			}

			if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
				const foundPath = findBlockPath( block.innerBlocks, targetId, newPath );
				if ( foundPath ) {
					return foundPath;
				}
			}
		}
		return null;
	}

	const foundPath = findBlockPath( rootBlocks, clientId, [] );
	return foundPath ? foundPath.join( '.' ) : '';
}

/**
 * Get block identifier
 * @param {string} clientId Block client ID
 * @param {Function} getBlock Function to get a block
 * @param {Function} getBlocks Function to get all blocks
 * @returns {Object} Block identifier { type: string, value: string }
 */
export function getBlockIdentifier( clientId, getBlock, getBlocks ) {
	const block = getBlock( clientId );

	if ( ! block ) {
		return null;
	}

	// 1. Check if block has anchor
	if ( block.attributes?.anchor ) {
		return { type: 'anchor', value: block.attributes.anchor };
	}

	// 2. Check if block has our custom commentBlockId
	if ( block.attributes?.commentBlockId ) {
		return { type: 'uuid', value: block.attributes.commentBlockId };
	}

	// 3. Generate position path as fallback
	const path = getBlockPath( clientId, getBlocks );
	return { type: 'path', value: path };
}

/**
 * Assign a UUID to a block
 * @param {string} clientId Block client ID
 * @param {Function} updateBlockAttributes Function to update block attributes
 * @returns {Object} Block identifier { type: string, value: string }
 */
export function assignBlockIdentifier( clientId, updateBlockAttributes ) {
	const commentBlockId = uuidv4();
	updateBlockAttributes( clientId, { commentBlockId } );
	return { type: 'uuid', value: commentBlockId };
}

/**
 * Compare two block identifiers
 * @param {Object} id1 First block ID
 * @param {Object} id2 Second block ID
 * @returns {boolean} True if identifiers match
 */
export function compareBlockIds( id1, id2 ) {
	if ( ! id1 || ! id2 ) {
		return false;
	}
	return id1.type === id2.type && id1.value === id2.value;
}
