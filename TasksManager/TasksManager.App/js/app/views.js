/// <reference path="../../Scripts/_references.js" />
window.viewsFactory = (function (Q, $) {
    
    var baseDirectory = "js/partials/",
        templates = {},
        getTemplate = function (name) {
            var deferred = Q.defer();
            if (templates[name]) {
                deferred.resolve(templates[name]);
            } else {
                $.ajax(baseDirectory + name + ".html", {
                    type: "GET",
                    success: function (templateHtml) {
                        templates[name] = templateHtml;
                        deferred.resolve(templateHtml);
                    },
                    error: function (error) {
                        deferred.reject(error);
                    }
                });
            }
            return deferred.promise;
        },
        getLoginView = function () {
            return getTemplate("login-view");
        },
        getListsView = function() {
            return getTemplate("lists-view");
        },
        getAppointmentsView = function () {
            return getTemplate("appointments-view");
        },
        getTodosView = function () {
            return getTemplate("todos-view");
        },
        getTodoStatusView = function () {
            return getTemplate("todo-status");
        };

    return {
        getLoginView: getLoginView,
        getListsView: getListsView,
        getAppointmentsView: getAppointmentsView,
        getTodosView: getTodosView,
        getTodoStatusView: getTodoStatusView
    };
}(window.Q, window.$));