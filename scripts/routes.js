var router = SS.Router({
        '/search' : {
            '/([^/]+)' : {
                on: doQuery(types["search"])
            },
            on: function() { setType("search") }
        },
        '/user' : {
            '/([^/]+)' : {
                on: doQuery(types["user"])
            },
            on: function() { setType("user") }
        }
});

router.init();