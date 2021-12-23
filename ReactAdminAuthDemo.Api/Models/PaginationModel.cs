using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Models
{
    public class PaginationModel<T> where T : class
    {
        private PaginationModel(IEnumerable<T> data, int total, int startRange, int endRange)
        {
            Data = data;
            _total = total;
            _startRange = startRange;
            _endRange = endRange;
        }

        private int _startRange, _endRange, _total;

        public IEnumerable<T> Data { get; private set; }
        public string ContentRange { get => $"{_startRange}-{_endRange}/{_total}"; }

        public void SetData(IEnumerable<T> data)
        {
            Data = data;
        }

        public static PaginationModel<U> CreatePaginationModel<U>(IEnumerable<U> data, int total, int startRange, int endRange) where U : class
        {
            return new PaginationModel<U>(data, total, startRange, endRange);
        }
    }
}
