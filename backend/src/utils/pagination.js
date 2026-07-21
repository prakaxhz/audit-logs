const pagination = (page = 1, limit = 10) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    return {
        page,
        limit,
        skip: (page - 1) * limit
    };

};

export default pagination;