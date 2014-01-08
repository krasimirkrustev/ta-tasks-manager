/// <reference path="../../Scripts/_references.js" />

window.httpRequester = (function (q, $) {
    
    var makeHttpGet = function (url, headers) {
        var deferred = q.defer();
        
        $.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            success: function (successData) {
                deferred.resolve(successData);
            },
            error: function (errorData) {
                deferred.reject(errorData);
            }
        });

        return deferred.promise;
    },
        makeHttpPost = function (url, data, headers) {
            var deferred = q.defer();

            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                timeout: 5000,
                data: JSON.stringify(data),
                headers: headers,
                success: function (successData) {
                    deferred.resolve(successData);
                },
                error: function (errorData) {
                    deferred.reject(errorData);
                }
            });

            return deferred.promise;
        },
        makeHttpPut = function (url, data, headers) {
            var deferred = q.defer();
            
            $.ajax({
                url: url,
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                timeout: 5000,
                data: JSON.stringify(data),
                headers: headers,
                success: function (successData) {
                    deferred.resolve(successData);
                },
                error: function (errorData) {
                    deferred.reject(errorData);
                }
            });

            return deferred.promise;
        };
    return {
        httpGet: makeHttpGet,
        httpPost: makeHttpPost,
        httpPut: makeHttpPut
    };
}(window.Q, window.$));