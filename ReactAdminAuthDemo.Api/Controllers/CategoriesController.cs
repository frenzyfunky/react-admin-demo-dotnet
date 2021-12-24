using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using ReactAdminAuthDemo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonOptions;

        public CategoriesController(
            IHttpClientFactory httpClientFactory,
            IOptions<JsonOptions> jsonOptions
            )
        {
            _httpClientFactory = httpClientFactory;
            _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Categories()
        {
            List<Category> products = new List<Category>();

            var client = _httpClientFactory.CreateClient("FakeProductsApi");
            var response = await client.GetAsync("categories");
            var content = await response.Content.ReadAsStringAsync();

            var list = JArray.Parse(content);

            List<Category> categories = new List<Category>();

            for (int i = 0; i < list.Count; i++)
            {
                categories.Add(new Category
                {
                    Id = i,
                    CategoryName = list[i].ToString()
                });
            }

            return Ok(categories);
        }
    }
}
