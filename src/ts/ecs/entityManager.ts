import {Entity} from '.';

/**
 * A manager of entities.
 */
export class EntityManager {
    /**
     * The next entity ID to be assigned.
     */
    private _nextEntityID: number;

    /**
     * The entities being managed by this instance.
     */
    private readonly _entities: Map<number, Entity>;

    /**
     * The entities being managed by this instance.
     */
    public get entities(): Entity[] {
        return Array.from(this._entities.values());
    }

    /**
     * Create a new instance.
     */
    public constructor() {
        this._nextEntityID = 0;
        this._entities = new Map<number, Entity>();
    }

    /**
     * Check whether this instance has an entity with the given ID.
     *
     * @param id - The ID of the entity to check for.
     *
     * @returns Whether this instance has an entity with the given ID.
     */
    public hasEntityByID(id: number): boolean {
        return this._entities.has(id);
    }

    /**
     * Get an entity by its ID.
     *
     * @param id - The ID of the entity to get.
     *
     * @returns The entity with the given ID, or `null` if no such entity
     * exists.
     */
    public getEntityByID(id: number): Entity | null {
        return this._entities.get(id) ?? null;
    }

    /**
     * Add an entity to this instance.
     *
     * @param entity - The entity to add.
     *
     * @throws Throws an {@link Error} if an entity with the same ID already
     * exists.
     */
    public addEntity(entity: Entity): void {
        if (this.hasEntityByID(entity.id)) {
            throw new Error(`Entity with ID ${entity.id} already exists`);
        }
        this._entities.set(entity.id, entity);
        if (entity.id > this._nextEntityID) {
            this._nextEntityID = entity.id + 1;
        }
    }

    /**
     * Remove an entity from this instance.
     *
     * @param entity - The entity to remove.
     */
    public removeEntity(entity: Entity): void {
        this._entities.delete(entity.id);
    }

    /**
     * Create a new entity.
     *
     * @param name - The name of the entity to create.
     *
     * @returns The new entity.
     */
    public createEntity(name?: string): Entity {
        const entity = new Entity(this._nextEntityID++, name);
        this.addEntity(entity);
        return entity;
    }
}
