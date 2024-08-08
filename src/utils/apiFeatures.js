class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    let filterQuery = { ...this.queryString };
    const options = ["limit", "page", "sort", "fields", "keyword"];
    options.forEach((option) => delete filterQuery[option]);
    filterQuery = JSON.stringify(filterQuery).replace(
      /\b(gt|gte|eq|ne|lt|lte)\b/gi,
      (match) => `$${match}`
    );
    filterQuery = JSON.parse(filterQuery);
    this.mongooseQuery.find(filterQuery);
    return this;
  }

  sort() {
    const { sort } = this.queryString;
    if (sort) {
      const sortOptions = sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortOptions);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    }
    return this;
  }

  fields() {
    const { fields } = this.queryString;
    if (fields) {
      const fieldOptions = fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldOptions);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    const { keyword } = this.queryString;
    let query = {};
    if (keyword) {
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(documentsCount) {
    const limit = parseInt(this.queryString.limit, 10) || 50;
    const page = parseInt(this.queryString.page, 10) || 1;
    const skip = (page - 1) * limit;
    const endIndex = limit * page;

    const pagination = {
      limit,
      currentPage: page,
      numberOfPages: Math.ceil(documentsCount / limit),
    };

    if (endIndex < documentsCount) pagination.next = page + 1;
    if (skip > 0) pagination.prev = page - 1;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
