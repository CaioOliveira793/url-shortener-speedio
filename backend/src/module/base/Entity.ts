export type EntityID = string;

export interface EntityState {
	version: number;
}

/**
 * Base entity class
 */
export abstract class Entity<T extends EntityState> {
	public readonly id: EntityID;
	protected state: T;

	protected constructor(id: EntityID, state: T) {
		this.id = id;
		this.state = state;
	}

	/**
	 * Increment the entity version number
	 *
	 * @returns {number} New entity version
	 */
	public incrementVersion(): number {
		this.state.version += 1;
		return this.state.version;
	}

	public internalState(): T {
		return structuredClone(this.state);
	}
}
