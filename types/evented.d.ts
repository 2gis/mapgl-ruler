/**
 * Event emitter
 */
export declare class Evented<M> {
    private readonly events;
    constructor();
    /**
     * Registers event listener
     * @param type Event type
     * @param listener Event handler
     */
    on<K extends keyof M>(type: K, listener: (ev: M[K]) => void): this;
    /**
     * Registers event listener which will be called once
     * @param type Event type
     * @param listener Event handler
     */
    once<K extends keyof M>(type: K, listener: (ev: M[K]) => void): this;
    /**
     * Removes event listener registered with `on`
     * @param type Event type
     * @param listener Event handler
     */
    off<K extends keyof M>(type: K, listener: (ev: M[K]) => void): this;
    /**
     * Calls all event listeners with event type `type`
     * @param type Event type
     * @param data Data transferred to events
     */
    emit<K extends keyof M>(type: K, data?: M[K]): this;
}
