import { FilterQuery, Document } from 'mongoose';
import { QueryString } from '@interfaces/queries.interface';

class APIFeatures<Q> {
  public query;
  public queryString;

  constructor(query: FilterQuery<Q>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  public filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el: string) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  public sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString;
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  public limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  public paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { APIFeatures };
