using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using ReactAdminAuthDemo.Api.Models;
using Microsoft.Extensions.Options;
using ReactAdminAuthDemo.Api.ModelBinders;
using Newtonsoft.Json.Linq;
using System.Linq.Expressions;
using ReactAdminAuthDemo.Api.Filters;

namespace ReactAdminAuthDemo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IFilter _filter;
        private readonly JsonSerializerOptions _jsonOptions;

        public ProductsController(
            IHttpClientFactory httpClientFactory, 
            IOptions<JsonOptions> jsonOptions,
            IFilter filter)
        {
            _httpClientFactory = httpClientFactory;
            _filter = filter;
            _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        //getList, getMany, getManyReference
        [HttpGet]
        public async Task<IActionResult> Products(
            [FromQuery(Name = "sort"), ModelBinder(BinderType = typeof(CustomArrayModelBinder))] string[] sort,
            [FromQuery(Name = "range"), ModelBinder(BinderType = typeof(CustomArrayModelBinder))] int[] range,
            [FromQuery(Name = "filter"), ModelBinder(BinderType = typeof(CustomJsModelBinder))] JObject filter)
        {
            List<Product> products = new List<Product>();

            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var response = await client.GetAsync("");
            int total = products.Count;

            products.AddRange(JsonSerializer.Deserialize<List<Product>>(await response.Content.ReadAsStringAsync(), _jsonOptions));

            var result = _filter.ApplyFilters<Product>(products, sort, range, filter);
            
            HttpContext.Response.Headers.Add("Content-Range", $"products {result.ContentRange}");
            return Ok(result.Data);
        }

        public IEnumerable<T> FindByCondition<T>(Func<T, bool> expression, IEnumerable<T> source) where T : class
        {
            return source.Where(expression);
        }

        //getOne
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Product(int id)
        {
            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var response = await client.GetAsync($"{id}");
            var products = JsonSerializer.Deserialize<Product>(await response.Content.ReadAsStringAsync(), _jsonOptions);

            return Ok(products);
        }

        //create
        [HttpPost]
        [Consumes("application/json")]
        public async Task<IActionResult> ProductCreate([FromBody] Product product)
        {
            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var str = JsonSerializer.Serialize(product, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var content = new StringContent(str);
            content.Headers.ContentType.MediaType = "application/json";
            var response = await client.PostAsync("", content);

            if (response.IsSuccessStatusCode)
            {
                var contentResult = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<Product>(contentResult, _jsonOptions);
                return CreatedAtAction(nameof(Product), new { id = result.Id }, result);
            }

            return BadRequest(response.ReasonPhrase);
        }

        //update
        [HttpPut]
        [Route("{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> ProductUpdate([FromBody] Product product, [FromRoute] int id)
        {
            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var str = JsonSerializer.Serialize(product, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var content = new StringContent(str);
            content.Headers.ContentType.MediaType = "application/json";
            var response = await client.PutAsync($"{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var contentResult = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<Product>(contentResult, _jsonOptions);
                return Ok(result);
            }

            return BadRequest(response.ReasonPhrase);
        }

        //delete
        [HttpDelete]
        [Route("{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> ProductDelete([FromRoute] int id)
        {
            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var response = await client.DeleteAsync($"{id}");

            if (response.IsSuccessStatusCode)
            {
                var contentResult = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<Product>(contentResult, _jsonOptions);
                return Ok(result);
            }

            return BadRequest(response.ReasonPhrase);
        }
    }
}
