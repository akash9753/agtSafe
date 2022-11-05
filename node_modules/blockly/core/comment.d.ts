/**
 * @license
 * Copyright 2011 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './events/events_block_change.js';
import './events/events_bubble_open.js';
import type { BlockSvg } from './block_svg.js';
import { Icon } from './icon.js';
import type { Size } from './utils/size.js';
/**
 * Class for a comment.
 *
 * @alias Blockly.Comment
 */
export declare class Comment extends Icon {
    private readonly model_;
    /**
     * The model's text value at the start of an edit.
     * Used to tell if an event should be fired at the end of an edit.
     */
    private cachedText_;
    /** Mouse up event data. */
    private onMouseUpWrapper_;
    /** Wheel event data. */
    private onWheelWrapper_;
    /** Change event data. */
    private onChangeWrapper_;
    /** Input event data. */
    private onInputWrapper_;
    /**
     * The SVG element that contains the text edit area, or null if not created.
     */
    private foreignObject_;
    /** The editable text area, or null if not created. */
    private textarea_;
    /** The top-level node of the comment text, or null if not created. */
    private paragraphElement_;
    /** @param block The block associated with this comment. */
    constructor(block: BlockSvg);
    /**
     * Draw the comment icon.
     *
     * @param group The icon group.
     */
    protected drawIcon_(group: Element): void;
    /**
     * Create the editor for the comment's bubble.
     *
     * @returns The top-level node of the editor.
     */
    private createEditor_;
    /** Add or remove editability of the comment. */
    updateEditable(): void;
    /**
     * Callback function triggered when the bubble has resized.
     * Resize the text area accordingly.
     */
    private onBubbleResize_;
    /**
     * Resizes the text area to match the size defined on the model (which is
     * the size of the bubble).
     */
    private resizeTextarea_;
    /**
     * Show or hide the comment bubble.
     *
     * @param visible True if the bubble should be visible.
     */
    setVisible(visible: boolean): void;
    /** Show the bubble. Handles deciding if it should be editable or not. */
    private createBubble_;
    /** Show an editable bubble. */
    private createEditableBubble_;
    /**
     * Show a non-editable bubble.
     *
     * @suppress {checkTypes} Suppress `this` type mismatch.
     */
    private createNonEditableBubble_;
    /**
     * Dispose of the bubble.
     *
     * @suppress {checkTypes} Suppress `this` type mismatch.
     */
    private disposeBubble_;
    /**
     * Callback fired when an edit starts.
     *
     * Bring the comment to the top of the stack when clicked on. Also cache the
     * current text so it can be used to fire a change event.
     *
     * @param _e Mouse up event.
     */
    private startEdit_;
    /**
     * Get the dimensions of this comment's bubble.
     *
     * @returns Object with width and height properties.
     */
    getBubbleSize(): Size;
    /**
     * Size this comment's bubble.
     *
     * @param width Width of the bubble.
     * @param height Height of the bubble.
     */
    setBubbleSize(width: number, height: number): void;
    /**
     * Update the comment's view to match the model.
     *
     * @internal
     */
    updateText(): void;
    /**
     * Dispose of this comment.
     *
     * If you want to receive a comment "delete" event (newValue: null), then this
     * should not be called directly. Instead call block.setCommentText(null);
     */
    dispose(): void;
}
//# sourceMappingURL=comment.d.ts.map