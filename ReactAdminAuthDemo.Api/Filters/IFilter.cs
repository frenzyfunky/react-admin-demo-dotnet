using Newtonsoft.Json.Linq;
using ReactAdminAuthDemo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Filters
{
    public interface IFilter
    {
        PaginationModel<T> ApplyFilters<T>(IEnumerable<T> source, string[] sort = null, int[] range = null, JObject filter = null) where T : class;
    }
}
