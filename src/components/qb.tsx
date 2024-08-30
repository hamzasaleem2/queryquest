import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [loadedCount, setLoadedCount] = useState(0);
  const { results: players, status, loadMore } = usePaginatedQuery(
    api.players.getFilteredPaginated,
    filterArgs,
    { initialNumItems: 51 }
  );

  const lastRowRef = useRef<HTMLTableRowElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (lastRowRef.current) {
      observer.observe(lastRowRef.current);
    }
    return () => observer.disconnect();
  }, [handleObserver, players]);

  useEffect(() => {
    setIsLoading(status === 'LoadingMore' || status === 'LoadingFirstPage');
  }, [status]);

  useEffect(() => {
    if (players) {
      setLoadedCount(players.length);
    }
  }, [players]);

  const handleRunQuery = () => {
    setIsLoading(true);
    setFilterArgs({
      serializedPredicate: JSON.stringify(query),
      serializedFields: JSON.stringify(fields)
    });
    setTimeout(() => setIsLoading(false), 100);
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
    <div className="max-w-full mx-auto space-y-6 overflow-x-auto">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <QueryBuilder
          fields={fields}
          query={query}
          operators={operators}
          onQueryChange={q => setQuery(q)}
          controlClassnames={{
            queryBuilder: 'p-4 min-w-[300px]',
            ruleGroup: 'flex flex-wrap items-center bg-gray-200 p-2 sm:p-4 rounded-md mb-4',
            combinators: 'mb-2 sm:mb-0 sm:mr-2',
            addRule: 'bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 mb-2 sm:mb-0 sm:mr-2',
            addGroup: 'bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 mb-2 sm:mb-0 sm:mr-2',
            removeGroup: 'bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600',
            removeRule: 'text-red-500 hover:text-red-700',
            rule: 'flex flex-wrap items-center mb-2 sm:mb-0',
            fields: 'mb-2 sm:mb-0 sm:mr-2',
            operators: 'mb-2 sm:mb-0 sm:mr-2',
            value: 'mb-2 sm:mb-0 sm:mr-2',
          }}
        />
        <div className="mt-4 flex flex-wrap justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleClearQuery}
            className="w-full sm:w-auto bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 ease-in-out"
          >
            Clear Filters
          </button>
          <button
            onClick={handleRunQuery}
            className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
          >
            Run Query
          </button>
        </div>
      </div>
      {players && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-600">Players:</h2>
            <div className="text-sm text-indigo-600 min-w-[120px] text-right">
              {isLoading ? (
                "Loading..."
              ) : (
                `Loaded: ${loadedCount} ${loadedCount === 1 ? 'document' : 'documents'}`
              )}
            </div>
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
                  {status === "LoadingMore" && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        Loading more...
                      </td>
                    </tr>
                  )}
                  {players.map((player, index) => (
                    <tr
                      key={player._id}
                      ref={index === players.length - 1 ? lastRowRef : null}
                    >
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
        </div>
      )}
    </div>
  );
}