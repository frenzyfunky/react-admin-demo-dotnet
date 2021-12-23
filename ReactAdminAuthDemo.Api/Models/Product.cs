using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Models
{
    public class Product
    {
        [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Image { get; set; }
        public Rating Rating { get; set; }
    }

    public class Rating
    {
        public decimal Rate { get; set; }
        public decimal Count { get; set; }
    }
}
