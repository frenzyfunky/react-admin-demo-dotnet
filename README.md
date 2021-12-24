## React-Admin demo with .NET Api
This is a demo project using [react-admin](https://github.com/marmelab/react-admin) with Next.js and .NET as a backend API to give an idea how things work. .NET Api consumes another api called [FakeStoreApi](https://fakestoreapi.com/). That's why some features like create, update, delete may not be work as exptected.

API is developed with the react-admin's query string conventions as mentioned in the [docs](https://marmelab.com/react-admin/DataProviders.html).
Authentication is provided by JWT tokens and handled by .NET api using AspNetCore.Identity