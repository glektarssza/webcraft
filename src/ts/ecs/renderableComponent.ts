import {Component} from '.';

export interface RenderableComponent extends Component {
    /**
     * Render this instance.
     *
     * @param context - The WebGL rendering context to use.
     */
    render(context: WebGLRenderingContext): void;
}

/**
 * Check whether the given component is a {@link RenderableComponent}.
 *
 * @param component - The component to check.
 *
 * @returns Whether the given component is a {@link RenderableComponent}.
 */
export function isRenderableComponent(
    component: Component
): component is RenderableComponent {
    return (
        Reflect.has(component, 'render') &&
        Reflect.get(component, 'render') instanceof Function
    );
}
