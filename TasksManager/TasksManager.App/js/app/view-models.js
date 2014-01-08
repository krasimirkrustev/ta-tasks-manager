/// <reference path="../../Scripts/_references.js" />

window.viewModelsFactory = (function (kendo) {
    var data = null,
        getLoginViewModel = function (successCallback) {
            var viewModel = {
                registerUsername: "",
                registerPassword: "",
                registerEmail: "",
                loginUsername: "",
                loginPassword: "",
                login: function () {
                    data.users.login(this.get("loginUsername"), this.get("loginPassword"))
                    .then(function () {
                        //this.set("loginUsername", "");
                        //this.set("loginPassword", "");
                        if (successCallback) {
                            successCallback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                },
                register: function () {
                    data.users.register(this.get("registerUsername"), this.get("registerPassword"), this.get("registerEmail"))
                        .then(function (success) {
                            this.set("registerUsername", "");
                            this.set("registerPassword", "");
                            this.set("registerEmail", "");
                            var userInfo = {
                                id: success.id,
                                username: success.username
                            };

                        }, function (error) {
                            var errorMessage = {
                                Message: error.responseText
                            };
                        });
                }
            };
            return kendo.observable(viewModel);
        },
        getListsViewModel = function () {
            var viewModel = {
                title: "",
                lists: [],
                create: function () {
                    var self = this;
                    data.lists.create(this.get("title"))
                        .then(function (success) {
                            self.get("lists").push({ id: success.id, title: self.get("title") });
                        });
                }
            };

            return data.lists.getAll()
                .then(function (success) {
                    viewModel.lists = success;
                    return kendo.observable(viewModel);
                }, function () {
                    return kendo.observable(viewModel);
                });
        },
        getTodosViewModel = function (id) {
            var viewModel = {
                text: "",
                listId: id,
                title: "",
                todos: [],
                create: function () {
                    var self = this;
                    data.lists.createTodoForList(this.get("listId"), this.get("text"))
                        .then(function (success) {
                            self.get("todos").push({
                                todoId: self.get("todos")[self.get("todos").length - 1].todoId + 1,
                                text: self.get("text"),
                                isDone: success.isDone,
                                changeStatus: function (e) {
                                    data.todos.changeStatus(this.get("todoId"))
                                        .then(function () {
                                            if ($(e.currentTarget).hasClass("btn-danger")) {
                                                $(e.currentTarget).removeClass("btn-danger");
                                                $(e.currentTarget).addClass("btn-success");
                                                $(e.currentTarget).text("DONE");
                                            } else {
                                                $(e.currentTarget).removeClass("btn-success");
                                                $(e.currentTarget).addClass("btn-danger");
                                                $(e.currentTarget).text("NOT DONE");
                                            }
                                        });
                                }
                            });
                        });
                }
            };

            return data.lists.getSingle(id)
                .then(function (success) {
                    viewModel.title = success.title;
                    for (var i = 0; i < success.todos.length; i++) {
                        viewModel.todos.push({
                            todoId: success.todos[i].id,
                            text: success.todos[i].text,
                            isDone: success.todos[i].isDone,
                            changeStatus: function (e) {
                                data.todos.changeStatus(this.get("todoId"))
                                .then(function () {
                                    if ($(e.currentTarget).hasClass("btn-danger")) {
                                        $(e.currentTarget).removeClass("btn-danger");
                                        $(e.currentTarget).addClass("btn-success");
                                        $(e.currentTarget).text("DONE");
                                    } else {
                                        $(e.currentTarget).removeClass("btn-success");
                                        $(e.currentTarget).addClass("btn-danger");
                                        $(e.currentTarget).text("NOT DONE");
                                    }
                                });
                            }
                        });
                    }
                    return kendo.observable(viewModel);
                }, function () {
                    return kendo.observable(viewModel);
                });
        },
        getAppointmentsViewModel = function () {
            var viewModel = {
                appointments: [],
                subject: "",
                description: "",
                appointmentDate: "",
                duration: "",
                create: function () {
                    var self = this;
                    data.appointments.create(this.get("subject"), this.get("description"), this.get("appointmentDate"), this.get("duration"))
                        .then(function () { 
                            data.appointments.getAll()
                                .then(function (appointments) {
                                    self.set("appointments", appointments);
                                });
                        });
                }
            };

            return data.appointments.getAll()
                .then(function (appointments) {
                    viewModel.appointments = appointments;
                    return kendo.observable(viewModel);
                });
        };

    return {
        getLoginViewModel: getLoginViewModel,
        getListsViewModel: getListsViewModel,
        getTodosViewModel: getTodosViewModel,
        getAppointmentsViewModel: getAppointmentsViewModel,
        setPersister: function (persister) {
            data = persister;
        }
    };
}(window.kendo));