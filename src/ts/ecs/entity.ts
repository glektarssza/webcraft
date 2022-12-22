import {isRenderableComponent, Component} from '.';

/**
 * The root entity type.
 */
export class Entity {
    /**
     * The components attached to this instance.
     */
    private readonly _components: Component[];

    /**
     * The ID of this instance.
     */
    public readonly id: number;

    /**
     * A human-friendly name for this instance.
     */
    public name: string;

    /**
     * A shallow clone of the components attached to this instance.
     */
    public get components(): Component[] {
        return this._components.slice();
    }

    /**
     * Create a new instance.
     *
     * @param id - The ID of this instance.
     * @param name - A human-friendly name for this instance.
     */
    public constructor(id: number, name?: string) {
        this._components = [];
        this.id = id;
        this.name = name ?? `Entity ${id}`;
    }

    /**
     * Get the first component of the given type.
     *
     * @param type - The type to get.
     *
     * @returns The first component of the given type, or `null` if none exists.
     */
    public getFirstComponentOfType(type: string): Component | null {
        return (
            this._components.find((component) => component.type === type) ??
            null
        );
    }

    /**
     * Get all components of the given type.
     *
     * @param type - The type to get.
     *
     * @returns All components of the given type.
     */
    public getComponentsOfType(type: string): Component[] {
        return this._components.filter((component) => component.type === type);
    }

    /**
     * Check whether this instance has a component of the given type.
     *
     * @param type - The type to check for.
     */
    public hasComponentOfType(type: string): boolean {
        return this._components.some((component) => component.type === type);
    }

    /**
     * Add a component to this instance.
     *
     * @param component - The component to add.
     */
    public addComponent(component: Component): void {
        this._components.push(component);
    }

    /**
     * Remove a component from this instance.
     *
     * @param component - The component to remove.
     */
    public removeComponent(component: Component): void {
        const index = this._components.indexOf(component);
        if (index >= 0) {
            this._components.splice(index, 1);
        }
    }

    /**
     * Update this instance.
     *
     * @param delta - The time, in milliseconds, since the last update.
     */
    public update(delta: number): void {
        this._components.forEach((component) => component.update(delta));
    }

    /**
     * Render this instance.
     *
     * @param context - The WebGL rendering context to use.
     */
    public render(context: WebGLRenderingContext): void {
        this._components
            .filter(isRenderableComponent)
            .forEach((component) => component.render(context));
    }
}
