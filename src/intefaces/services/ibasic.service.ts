export default interface IBasicService<T> {
  getAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(entity: T): Promise<T>;
  update(oldEntity: T, newEntity: T): Promise<T>;
}
