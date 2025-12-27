import { useSelect } from '@wordpress/data';
import { getBlockIdentifier } from '../utils/block-identifier';

/**
 * Custom hook to track selected block
 */
export default function useBlockSelection() {
	const { selectedBlockId, selectedClientId, selectedBlock } = useSelect( ( select ) => {
		const blockEditorStore = select( 'core/block-editor' );
		const selectedClientId = blockEditorStore.getSelectedBlockClientId();

		if ( ! selectedClientId ) {
			return {
				selectedBlockId: null,
				selectedClientId: null,
				selectedBlock: null,
			};
		}

		const block = blockEditorStore.getBlock( selectedClientId );
		const blockId = getBlockIdentifier(
			selectedClientId,
			blockEditorStore.getBlock,
			blockEditorStore.getBlocks
		);

		return {
			selectedBlockId: blockId,
			selectedClientId,
			selectedBlock: block,
		};
	} );

	return {
		selectedBlockId,
		selectedClientId,
		selectedBlock,
	};
}
