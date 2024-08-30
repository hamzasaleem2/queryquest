import { query } from './_generated/server';
import { v } from 'convex/values';
import { convertQueryToFilterPredicate } from './predicatefn';
import { filter } from 'convex-helpers/server/filter';
import { paginationOptsValidator } from "convex/server";

export const getFilteredPaginated = query({
  args: { 
    serializedPredicate: v.string(),
    serializedFields: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const query = JSON.parse(args.serializedPredicate);
    const fields = JSON.parse(args.serializedFields);
    const filterPredicate = convertQueryToFilterPredicate(query, fields);
    
    const paginatedResults = await filter(ctx.db.query("players"), filterPredicate)
      .paginate(args.paginationOpts);

    return paginatedResults;
  },
});