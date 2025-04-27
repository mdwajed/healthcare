type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

export const calculatePagination = (options: IOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = Number((page - 1) * limit);
  const sortBy = options.sortBy || "name";
  const sortOrder = options.sortOrder || "asc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
