var router = SS.Router({
        '/search' : {
            '/([^/]+)' : {
                on: doSearch
            },
            on: function() { setType("search") }
        },
        '/user' : {
            '/([^/]+)' : {
                on: doUser
            },
            on: function() { setType("user") }
        }
});

router.init();