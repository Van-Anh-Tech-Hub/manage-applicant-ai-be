import { Op, WhereOptions } from 'sequelize';

export const convertWhereCondition = (condition: any): WhereOptions => {
    if (!condition || typeof condition !== 'object') return condition;

    const sequelizeOperators: Record<string, symbol> = {
        and: Op.and,
        or: Op.or,
        gt: Op.gt,
        gte: Op.gte,
        lt: Op.lt,
        lte: Op.lte,
        ne: Op.ne,
        eq: Op.eq,
        like: Op.like,
        in: Op.in,
        notIn: Op.notIn,
        between: Op.between,
    };

    return Object.entries(condition).reduce((acc, [key, value]) => {
      if (sequelizeOperators[key]) {
        acc[sequelizeOperators[key]] = Array.isArray(value)
          ? value.map(convertWhereCondition)
          : convertWhereCondition(value);
      } else {
        acc[key] = convertWhereCondition(value);
      }
      return acc;
    }, {} as WhereOptions);
};
