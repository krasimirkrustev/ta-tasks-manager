/// <reference path="../../Scripts/_references.js" />

window.persisters = (function (Class, httpRequester, cryptoJs) {

    var UsersPersister = Class.create({
        init: function (baseUrl, authUrl) {
            this.baseUrl = baseUrl;
            this.authUrl = authUrl;
        },
        isUserLoggedIn: function () {
            var currentUser = localStorage.getItem("username"),
                accessToken = localStorage.getItem("accessToken");

            return ((currentUser) && (accessToken));
        },
        register: function (username, password, email) {
            var hash = cryptoJs.SHA1(password).toString(),
                user = {
                    username: username,
                    email: email,
                    authCode: hash
                };

            return httpRequester.httpPost(this.baseUrl + "/register", user);
        },
        login: function (username, password) {
            var hash = cryptoJs.SHA1(password).toString(),
                user = {
                    username: username,
                    authCode: hash
                };

            return httpRequester.httpPost(this.authUrl + "/token", user)
                .then(function (success) {
                    localStorage.setItem("username", success.username);
                    localStorage.setItem("accessToken", success.accessToken);

                    return success;
                }, function (error) {
                    return error;
                });
        },
        logout: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpPut(this.apiUrl + "/logout", "", headers)
                .then(function () {
                    localStorage.removeItem("username");
                    localStorage.removeItem("accessToken");

                    return null;

                }, function (error) {
                    return error;
                });
        }
    });

    var ListsPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
        },
        create: function (title) {
            var newList = {
                title: title,
                todos: []
            },
                headers = {
                    "X-accessToken": localStorage.getItem("accessToken")
                };

            return httpRequester.httpPost(this.baseUrl, newList, headers);
        },
        getAll: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpGet(this.baseUrl, headers);
        },
        getSingle: function (id) {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpGet(this.baseUrl + "/" + id, headers);
        },
        createTodoForList: function (id, text) {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            },
                todoForCreation = {
                    text: text
                };

            return httpRequester.httpPost(this.baseUrl + "/" + id + "/todos", todoForCreation, headers);
        }
    });

    var TodosPersister = Class.create({
        init: function (baseApi) {
            this.baseApi = baseApi;
        },
        changeStatus: function (id) {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpPut(this.baseApi + "/" + id, "", headers);
        }
    });

    var AppointmentsPersister = Class.create({
        init: function (baseApi) {
            this.baseApi = baseApi;
        },
        create: function (subject, description, date, duration) {
            var appointment = {
                subject: subject,
                description: description,
                appointmentDate: date,
                duration: duration
            },
                headers = {
                    "X-accessToken": localStorage.getItem("accessToken")
                };

            return httpRequester.httpPost(this.baseApi + "/new", appointment, headers);
        },
        getAll: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpGet(this.baseApi + "/all", headers);
        },
        getAllUpcomming: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpPost(this.apiUrl + "/comming", headers);
        },
        getAllForDate: function (date) {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpGet(this.apiUrl + "?date=" + date, headers);
        },
        getAllForToday: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpPost(this.apiUrl + "/today", headers);
        },
        getAllCurrent: function () {
            var headers = {
                "X-accessToken": localStorage.getItem("accessToken")
            };

            return httpRequester.httpPost(this.apiUrl + "/current", headers);
        }
    });


    var MainPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
            this.users = new UsersPersister(this.baseUrl + "/users", this.baseUrl + "/auth");
            this.lists = new ListsPersister(this.baseUrl + "/lists");
            this.todos = new TodosPersister(this.baseUrl + "/todos");
            this.appointments = new AppointmentsPersister(this.baseUrl + "/appointments");
        }
    });

    return {
        get: function (apiUrl) {
            return new MainPersister(apiUrl);
        }
    };
}(window.Class, window.httpRequester, window.CryptoJS));