using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using ReactAdminAuthDemo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Filters
{
    public class Filter : IFilter
    {
        private readonly ILogger<Filter> _logger;

        public Filter(ILogger<Filter> logger)
        {
            _logger = logger;
        }
        public PaginationModel<T> ApplyFilters<T>(IEnumerable<T> source, string[] sort = null, int[] range = null, JObject filter = null) where T : class
        {
            List<T> tmp = source.ToList();
            
            if (filter != null)
            {
                var dict = new Dictionary<string, object>();

                foreach (var jToken in filter)
                {
                    var name = jToken.Key;
                    object value = null;

                    if (jToken.Value.Type == JTokenType.String)
                    {
                        value = jToken.Value.Value<string>();
                    }
                    else if (jToken.Value.Type == JTokenType.Integer)
                    {
                        value = jToken.Value.Value<int>();
                    }
                    else if (jToken.Value.Type == JTokenType.Array)
                    {
                        value = jToken.Value.Values<int>().ToArray();
                    }

                    dict.Add(name, value);
                }

                List<Expression<Func<T, bool>>> predicateList = new List<Expression<Func<T, bool>>>();

                foreach (var item in dict)
                {
                    var key = System.Globalization.CultureInfo.InvariantCulture.TextInfo.ToTitleCase(item.Key.ToLower());

                    var type = item.Value.GetType();
                    if (type.FullName == "System.Int32[]")
                    {
                        var castedValue = (int[])item.Value;

                        foreach (var value in castedValue)
                        {
                            predicateList.Add(DynamicExpressions.DynamicExpressions.GetPredicate<T>(key, DynamicExpressions.FilterOperator.Equals, value));
                        }
                    }
                    else
                    {
                        predicateList.Add(DynamicExpressions.DynamicExpressions.GetPredicate<T>(key, DynamicExpressions.FilterOperator.Equals, item.Value));
                    }
                }

                try
                {
                    tmp = new List<T>();

                    foreach (var predicate in predicateList)
                    {
                        var item = source.Where(predicate.Compile());
                        if (item != null)
                        {
                            tmp.AddRange(item);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                }
            }

            if (sort != null && sort.Length == 2)
            {
                var key = System.Globalization.CultureInfo.InvariantCulture.TextInfo.ToTitleCase(sort[0].Replace("\"", ""));
                var value = sort[1].Replace("\"", "");

                var propertyGetter = DynamicExpressions.DynamicExpressions.GetPropertyGetter<T>(key).Compile();

                if (value == "ASC")
                {
                    tmp = tmp.OrderBy(propertyGetter).ToList();
                }
                else if (value == "DESC")
                {
                    tmp = tmp.OrderByDescending(propertyGetter).ToList();
                }
            }

            var result = PaginationModel<T>.CreatePaginationModel(tmp, tmp.Count(), range != null ? range[0] : 0, range != null ? range[1] : 0);

            if (range != null)
            {
                result.SetData(result.Data.Skip(range[0]).Take(range[1] - range[0]));
            }

            return result;
        }
    }
}
