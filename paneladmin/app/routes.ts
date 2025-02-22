import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("./routes/Login/Login.tsx"),
    ...prefix("admin", [
        layout("./routes/AdminLayout.tsx", [
            index("./routes/Dashboard/Dashboard.tsx"),
            route("users", "./routes/Users/Users.tsx"),
            route("category", "./routes/Category/Category.tsx"),
        ])
    ])

] satisfies RouteConfig;
