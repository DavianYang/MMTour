import { Model, Document } from 'mongoose';
import { APIFeatures } from '@utils/apiFeatures';

export const findAll = async (Model: Model<Document>, query: object, id?: string) => {
  let filter = {};
  if (id) filter = { tour: id };

  const features = new APIFeatures(Model.find(filter), query).filter().sort().limitFields().paginate();

  const doc = await features.query;
  return doc;
};

export const findOne = async (Model: Model<Document>, id: string, popOption?: object) => {
  let query: any = Model.findById(id);
  if (popOption) query = await query.populate(popOption);
  const doc = await query;
  return doc;
};

export const createOne = async (Model: Model<Document>, body: object) => await Model.create(body);

export const updateOne = async (Model: Model<Document>, id: string, body: object) =>
  await Model.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

export const deleteOne = async (Model: Model<Document>, id: string) => Model.findByIdAndRemove(id);
