import { useEffect, useState } from 'react';
import { Field, Operator, QueryBuilder, RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { api } from '../convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';

const fields: Field[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'registrationDate', label: 'Registration Date', type: 'date', inputType: 'date' },
  { name: 'totalScore', label: 'Total Score', type: 'number', inputType: 'number' },
  { name: 'isActive', label: 'Is Active', type: 'boolean' },
];

const operators: Operator[] = [
  { name: '=', label: '=', value: '=' },
  { name: '!=', label: '!=', value: '!=' },
  { name: '<', label: '<', value: '<' },
  { name: '>', label: '>', value: '>' },
  { name: '<=', label: '<=', value: '<=' },
  { name: '>=', label: '>=', value: '>=' },
  { name: 'contains', label: 'contains', value: 'contains' },
  { name: 'beginsWith', label: 'beginsWith', value: 'beginsWith' },
  { name: 'endsWith', label: 'endsWith', value: 'endsWith' },
  { name: 'doesNotContain', label: 'doesNotContain', value: 'doesNotContain' },
];

export default function QB() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });
  const [filterArgs, setFilterArgs] = useState<{ serializedPredicate: string, serializedFields: string }>({
    serializedPredicate: JSON.stringify({ combinator: 'and', rules: [] }),
    serializedFields: JSON.stringify(fields)
  });
  const [isLoading, setIsLoading] = useState(false);

  const { results: players, status, loadMore } = usePaginatedQuery(
    api.players.getFilteredPaginated,
    filterArgs,
    { initialNumItems: 51 }
  );

  useEffect(() => {
    if (status === 'LoadingMore' || status === 'LoadingFirstPage') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const handleRunQuery = () => {
    setIsLoading(true);
    setFilterArgs({
      serializedPredicate: JSON.stringify(query),
      serializedFields: JSON.stringify(fields)
    });
  };

  const handleClearQuery = () => {
    const emptyQuery = { combinator: 'and', rules: [] };
    setQuery(emptyQuery);
    setFilterArgs({
      serializedPredicate: JSON.stringify(emptyQuery),
      serializedFields: JSON.stringify(fields)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <QueryBuilder
          fields={fields}
          query={query}
          operators={operators}
          onQueryChange={q => setQuery(q)}
          controlClassnames={{
            queryBuilder: 'p-4',
            ruleGroup: 'bg-gray-50 p-4 rounded-md mb-4',
            combinators: 'bg-white border border-gray-300 rounded px-3 py-2',
            addRule: 'bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600',
            addGroup: 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600',
            removeGroup: 'bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600',
            removeRule: 'text-red-500 hover:text-red-700',
          }}
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleClearQuery}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 ease-in-out"
          >
            Clear Filters
          </button>
          <button
            onClick={handleRunQuery}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
          >
            Run Query
          </button>
        </div>
      </div>
      {players && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-600">Players:</h2>
            {isLoading && (
              <div className="text-indigo-600">Loading...</div>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <tr key={player._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.registrationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.totalScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.isActive ? "true" : "false"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {status === "CanLoadMore" && (
            <button
              onClick={() => loadMore(10)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}