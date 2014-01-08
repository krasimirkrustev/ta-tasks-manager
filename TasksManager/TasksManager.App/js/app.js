/// <reference path="../Scripts/_references.js" />
(function (kendo, viewsFactory, viewModelsFactory, $, persisters) {

    var data = persisters.get("http://localhost:16183/api");
    viewModelsFactory.setPersister(data);

    var appLayout = new kendo.Layout("<div id=\"main\"  class=\"container\"></div>"),
        router = new kendo.Router();

    router.route("/", function () {
        router.navigate("/todo-lists");
    });
    
    router.route("/login", function () {
        var isLoggedIn = data.users.isUserLoggedIn();
        if (isLoggedIn) {
            router.navigate("/todo-lists");
        } else {
            viewsFactory.getLoginView()
            .then(function (loginViewHtml) {
                var loginViewModel = viewModelsFactory.getLoginViewModel(
                    function () {
                        router.navigate("/todo-lists");
                    }),
                    loginView = new kendo.View(loginViewHtml, {
                        model: loginViewModel
                    });
                appLayout.showIn("#main", loginView);
            });
        }
    });

    router.route("/appointments", function () {
        var isLoggedIn = data.users.isUserLoggedIn();
        if (!isLoggedIn) {
            router.navigate("/login");
        } else {
            viewsFactory.getAppointmentsView()
            .then(function (appointmentsViewHtml) {
                viewModelsFactory.getAppointmentsViewModel()
                .then(function (success) {
                    appointmentsView = new kendo.View(appointmentsViewHtml, {
                        model: success
                    });

                    appLayout.showIn("#main", appointmentsView);
                });
            });
        }
    });

    router.route("/todo-lists", function () {
        var isLoggedIn = data.users.isUserLoggedIn();
        if (!isLoggedIn) {
            router.navigate("/login");
        } else {
            viewsFactory.getListsView()
            .then(function (listsViewHtml) {
                viewModelsFactory.getListsViewModel()
                .then(function (success) {
                    listsView = new kendo.View(listsViewHtml, {
                        model: success
                    });

                    appLayout.showIn("#main", listsView);
                });
            });
        }
    });

    router.route("/todo-list/:id", function (id) {
        var isLoggedIn = data.users.isUserLoggedIn();
        if (!isLoggedIn) {
            router.navigate("/login");
        } else {
            viewsFactory.getTodosView()
            .then(function (todosViewHtml) {
                viewModelsFactory.getTodosViewModel(id)
                .then(function (success) {
                    todosView = new kendo.View(todosViewHtml, {
                        model: success
                    });

                    appLayout.showIn("#main", todosView);
                });
            });
        }
    });

    $(function () {
        appLayout.render("#app");
        router.start();
    });
}(window.kendo, window.viewsFactory, window.viewModelsFactory, window.$, window.persisters));