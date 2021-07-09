// class APIFeatures {
//   public query;
//   public queryString;

//   constructor(query: Function, queryString: string) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryObj = { ...(this.queryString as string) } as object;
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach(el => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));

//     return this;
//   }
// }

// export default APIFeatures;
