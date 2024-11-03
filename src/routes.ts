/*
 * SITE
 * Main entry point
 * 
 * https://engine.sygnal.com/
 * 
 * ENGINE MODE
 * ?engine.mode=dev
 * ?engine.mode=prod
 * 
 */

import { HomePage } from "./page/home";
import { RouteDispatcher } from "@sygnal/sse";
import { Site } from "./site";
import { ApplicationPage } from "./page/apply";
import { PreApplicationPage } from "./page/pre-apply";
import { MiniCoursePage } from "./page/mini-course";

export const routeDispatcher = (): RouteDispatcher => {
    
    var routeDispatcher = new RouteDispatcher(Site);
    routeDispatcher.routes = {

        // Site pages
        '/': HomePage,
        '/pre-application': PreApplicationPage, 
        '/application': ApplicationPage, 
        '/access/mini-course/course': MiniCoursePage, 

        // TEST Pages

    };

    return routeDispatcher;
}

