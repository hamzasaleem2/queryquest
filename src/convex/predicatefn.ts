import { RuleGroupType, RuleType, Field } from 'react-querybuilder';
import { DocumentByInfo, GenericTableInfo } from 'convex/server';

type Operator = '=' | '!=' | '<' | '>' | '<=' | '>=' | 'contains' | 'beginsWith' | 'endsWith' | 'doesNotContain';

function getFieldType(fieldName: string, fields: Field[]): string {
  const field = fields.find(f => f.name === fieldName);
  if (field && typeof field.type === 'string') {
    return field.type;
  }
  return 'text';
}

function parseValue(value: any, type: string): any {
  switch (type) {
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value === 'true' || value === true;
    default:
      return value;
  }
}

function createPredicate<T extends GenericTableInfo>(rule: RuleType, fields: Field[]): (doc: DocumentByInfo<T>) => boolean {
  const { field, operator, value } = rule;
  const fieldType = getFieldType(field, fields);
  const parsedValue = parseValue(value, fieldType);
  
  return (doc: DocumentByInfo<T>) => {
    const docValue = doc[field as keyof DocumentByInfo<T>];
    
    if (docValue === null || docValue === undefined || docValue === '') {
      switch (operator as Operator) {
        case '=': return parsedValue === null || parsedValue === '' || parsedValue === undefined;
        case '!=': return parsedValue !== null && parsedValue !== '' && parsedValue !== undefined;
        case 'contains':
        case 'beginsWith':
        case 'endsWith': return false;
        case 'doesNotContain': return true;
        default: return false;
      }
    }

    switch (operator as Operator) {
      case '=': return docValue === parsedValue;
      case '!=': return docValue !== parsedValue;
      case '<': return docValue < parsedValue;
      case '>': return docValue > parsedValue;
      case '<=': return docValue <= parsedValue;
      case '>=': return docValue >= parsedValue;
      case 'contains': return String(docValue).includes(String(parsedValue));
      case 'beginsWith': return String(docValue).startsWith(String(parsedValue));
      case 'endsWith': return String(docValue).endsWith(String(parsedValue));
      case 'doesNotContain': return !String(docValue).includes(String(parsedValue));
      default: return true;
    }
  };
}

function combinePredicates<T extends GenericTableInfo>(
  predicates: Array<(doc: DocumentByInfo<T>) => boolean>,
  combinator: 'and' | 'or'
): (doc: DocumentByInfo<T>) => boolean {
  return (doc: DocumentByInfo<T>) => {
    if (combinator === 'and') {
      return predicates.every(predicate => predicate(doc));
    } else {
      return predicates.some(predicate => predicate(doc));
    }
  };
}

export function convertQueryToFilterPredicate<T extends GenericTableInfo>(
  query: RuleGroupType,
  fields: Field[]
): (doc: DocumentByInfo<T>) => boolean {
  const predicates = query.rules.map(rule => {
    if ('rules' in rule) {
      return convertQueryToFilterPredicate<T>(rule, fields);
    } else {
      return createPredicate<T>(rule, fields);
    }
  });

  return combinePredicates<T>(predicates, query.combinator as 'and' | 'or');
}