﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactAdminAuthDemo.Api.Models
{
    public class TokenResponse
    {
        public string Token { get; set; }
        public DateTime ValidTo { get; set; }
    }
}
