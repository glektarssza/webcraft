import {glMatrix, mat3, mat4, quat, vec3} from 'gl-matrix';

/**
 * An object which describes a viewport into a 3D scene.
 */
export class Camera {
    /**
     * The matrix which transforms from world space to camera space.
     */
    public viewMatrix: mat4;

    /**
     * The projection matrix which transforms from camera space to clip space.
     */
    public projectionMatrix: mat4;

    /**
     * The position of the camera in the scene.
     */
    public position: vec3;

    /**
     * The rotation of the camera.
     */
    public rotation: quat;

    /**
     * The aspect ratio of the camera.
     */
    public aspectRatio: number;

    /**
     * The field of view of the camera.
     */
    public fieldOfView: number;

    /**
     * The near plane of the camera.
     */
    public nearPlane: number;

    /**
     * The far plane of the camera.
     */
    public farPlane: number;

    /**
     * Create a new instance.
     */
    public constructor() {
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.position = vec3.create();
        this.rotation = quat.create();
        this.aspectRatio = 1;
        this.fieldOfView = 45;
        this.nearPlane = 0.1;
        this.farPlane = 1000;
        this.updateMatrices();
    }

    /**
     * Look at the given target.
     *
     * @param target - The target to look at.
     * @param up - The up vector.
     */
    public lookAt(target: vec3, up: vec3 = [0, 1, 0]): void {
        const t = mat4.create();
        mat4.lookAt(t, this.position, target, up);
        mat4.getRotation(this.rotation, t);
    }

    /**
     * Update the matrices of the camera.
     */
    public updateMatrices(): void {
        mat4.identity(this.viewMatrix);
        mat4.fromQuat(this.viewMatrix, this.rotation);
        mat4.translate(
            this.viewMatrix,
            this.viewMatrix,
            vec3.negate(vec3.create(), this.position)
        );
        mat4.perspective(
            this.projectionMatrix,
            glMatrix.toRadian(this.fieldOfView),
            this.aspectRatio,
            this.nearPlane,
            this.farPlane
        );
    }
}
