

 

export type UserRole = "CUSTOMER" | "MANAGER" | "ADMIN" | "VENDOR" | "DELIVERY_MAN" | "WAREHOUSE_MANAGER" | "MANUAL_ORDER_ENTRY";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname:string) => {
    return authRoutes.some( (route:string) => route === pathname)
}

export type routeConfig = {
    exact : string[];
    pattern: RegExp[];
}

const commonProtectRoute:routeConfig = {
     exact : ["/my-profile", "/change-password"],
     pattern: []
}

const manualOrderEntryProtectRoute:routeConfig = { // TODO:
    exact : [], 
    pattern : [/^\/manual-order-entry\/dashboard/ ]
}

const adminProtectRoute:routeConfig = {// TODO:
    exact : [], 
    pattern : [/^\/admin(?:\/|$)/]
}

const customerProtectRoute:routeConfig = { // TODO:
    exact : [ "/payment/success"],
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
}



export const isRouteMatch = (pathname:string, routes:routeConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some( (pattern:RegExp) => pattern.test(pathname));
}






export const getOwnerRole = (pathname:string):"CUSTOMER" | "MANAGER" | "ADMIN" | "VENDOR" | "DELIVERY_MAN" | "WAREHOUSE_MANAGER" | "MANUAL_ORDER_ENTRY" |"COMMON"|null => {

    if(isRouteMatch(pathname, adminProtectRoute)) {
        return "ADMIN";
    }

    if(isRouteMatch(pathname, customerProtectRoute)) {
        return "CUSTOMER";
    }

    if(isRouteMatch(pathname, manualOrderEntryProtectRoute)) {
        return "MANUAL_ORDER_ENTRY";
    }

    if(isRouteMatch(pathname, commonProtectRoute)) {
        return "COMMON";
    }


    return null;
}



export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN" || role === "MANAGER") {
        return "/admin/dashboard";
    }
    if(role === "MANUAL_ORDER_ENTRY") {
        return "/MANUAL_ORDER_ENTRY/dashboard";
    }
    if(role === "CUSTOMER") {
        return "/dashboard";
    }

    return "/";
}


export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const unifySuperAdminAndAdminRole = role === "MANAGER" ? "ADMIN" : role;

    role = unifySuperAdminAndAdminRole;

    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getOwnerRole(sanitizedRedirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}

