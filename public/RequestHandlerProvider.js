import * as data from './countries.json';

const getRequestBody = (params, queryFilter, timeFilter) => {
  const requestBody = {
    'size': 0,
    'query': {
      'bool': {
        'must': [
          {
            'range': {
              'timestamp': {
                'gte': timeFilter.from,
                'lte': timeFilter.to
              }
            }
          }
        ]
      }
    },
    'aggs': {
      'sessions': {
        'terms': {
          'field': params.sessionField,
          'size': params.maxSessionCount
        },
        'aggs': {
          'first_events': {
            'top_hits': {
              'sort': [
                {
                  [params.timeField]: {
                    'order': 'asc'
                  }
                }
              ],
              '_source': {
                'includes': [params.actionField]
              },
              'size': params.maxSessionLength
            }
          }
        }
      }
    }
  };
  const queries = queryFilter.getFilters();
  if (queries && queries.length) {
    queries.forEach(({ meta }) => {
      if (meta.disabled) return;
      let query;
      switch (meta.type) {
        case 'phrase':
          query = {
            match: {
              [meta.key]: meta.value
            }
          };
          addMustQuery(requestBody, query, meta);
          break;
        case 'phrases':
          meta.params.forEach(param => {
            query = {
              match: {
                [meta.key]: param
              }
            };
            addShouldQuery(requestBody, query, meta);
          });
          break;
        case 'range':
          query = {
            range: {
              [meta.key]: meta.params
            }
          };
          addRangeQuery(requestBody, query, meta);
          break;
        case 'exists':
          query = {
            exists: {
              field: meta.key
            }
          };
          addMustQuery(requestBody, query, meta);
      }
    });
  }
  return requestBody;
};

function addMustQuery(request, query, { negate }) {
  const boolObject = request.query.bool;
  let matcher;
  if (negate) {
    matcher = boolObject.must_not ? boolObject.must_not : (boolObject.must_not = []);
  } else {
    matcher = boolObject.must ? boolObject.must : (boolObject.must = []);
  }
  matcher.push(query);
}

function addShouldQuery(request, query, { negate }) {
  let matcher;
  if (negate) {
    matcher = request.query.bool.must_not ? request.query.bool.must_not : (request.query.bool.must_not = []);
  } else {
    matcher = request.query.bool.should ? request.query.bool.should : (request.query.bool.should = []);
    request.query.bool.minimum_should_match = 1;
  }
  matcher.push(query);
}

function addRangeQuery(request, query, { negate }) {
  let matcher;
  if (negate) {
    matcher = request.query.bool.must_not ? request.query.bool.must_not : (request.query.bool.must_not = []);
  } else {
    matcher = request.query.bool.must;
  }
  matcher.push(query);
}

async function getData() {
  return data;
}

export function RequestHandlerProvider(Private, es) { 
  return {
    handle(vis) {
      const { timeFilter, queryFilter } = vis.API;
      return new Promise(resolve => {
        const params = vis.params;
        var filters = getRequestBody(params, queryFilter, timeFilter._time);
        console.log(filters.length);
        var requestBody = {
          filters: filters,
          predictionTarget: vis.aggs[0].params.field.name
        };
        getData().then(result => resolve(result));
      });
    }
  };
}