import { Model, Document } from 'express';

export const findOne = async (Model: Model<Document>, id: string, popOption?: object) => {
  let query = Model.findById(id);
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
