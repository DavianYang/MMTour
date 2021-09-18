import { DocumentDefinition, FilterQuery } from 'mongoose';
import { QueryString } from '@interfaces/queries.interface';
import { APIFeatures } from '@utils/apiFeatures';

export const findAll = async <T>(Model: FilterQuery<T>, query: QueryString) => {
  let filter = {};
  if (query.id) filter = { tour: query.id };

  const features = new APIFeatures(Model.find(filter), query).filter().sort().limitFields().paginate();

  const doc = await features.query;
  return doc;
};

export const findOne = async <T>(Model: FilterQuery<T>, id: string, popOption?: object) => {
  let query: any = Model.findById(id);
  if (popOption) query = await query.populate(popOption);
  const doc = await query;
  return doc;
};

export const createOne = async <T, B>(Model: FilterQuery<T>, body: DocumentDefinition<B>) => await Model.create(body);

export const updateOne = async <T>(Model: FilterQuery<T>, id: string, body: object) =>
  await Model.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

export const deleteOne = async <T>(Model: FilterQuery<T>, id: string) => Model.findByIdAndRemove(id);
