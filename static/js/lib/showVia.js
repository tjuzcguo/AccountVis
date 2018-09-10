var myApp = angular.module('getVialbles', []);
var a = 0;
myApp.controller('showViables', function ($scope, $http, $rootScope) {

    function loadTree() {
        $http.get("/api/showTree").success(function (data) {
            $rootScope.varialbes = data;
            $scope.treeView(data)
        }).error(function () {
            console.log("tree json error!");
        });
    };
    if (a == 0) {
        loadTree();
        a = 1;
    }


    $scope.search = function () {
        var inputVar = $("#inputVar").val();
        $http.get("/api/acquireVarsBySearchName", {
            params: {
                "name": inputVar
            }
        }).success(function (data) {
            $rootScope.searchResult = data;
        });

    }


    // $scope.category='1';
    // $scope.setCategory = function(id){
    //     $scope.category=id;
    //     $http.get("/api/acquireVars",{
    //         params:{
    //             "category":$scope.category
    //         }
    //     }).success(function(data){
    //         $rootScope.varialbes=data;
    //     });
    // };

    var typeMap = new Map();
    typeMap.set(0, '布尔型-0');
    typeMap.set(1, '整型-1');
    typeMap.set(2, '长整型-2');
    typeMap.set(3, '单精度浮点型-3');
    typeMap.set(4, '双精度浮点型-4');
    typeMap.set(5, '字符型-5');
    typeMap.set(6, '未知-6');

    var categoryMap = new Map();
    categoryMap.set('1', '蜜罐-1');
    categoryMap.set('2', '灰度分-2');
    categoryMap.set('3', '风控变量-3');
    categoryMap.set('4', '消费标签-4');
    $rootScope.variableTypeNs = ["布尔型-0", "整型-1", "长整型-2", "单精度浮点型-3", "双精度浮点型-4", "字符型-5", "未知-6"];
    $rootScope.variableCategoryNs = ["蜜罐-1", "灰度分-2", "风控变量-3", "消费标签-4"];

    $scope.showDetail = function (name) {
        $scope.name = name;
        $http.get("/api/acquireVarsByName", {
            params: {
                "name": $scope.name
            }
        }).success(function (data) {
            $rootScope.detail = data;
            $rootScope.variableName = $rootScope.detail.name;
            $rootScope.variableType = typeMap.get($rootScope.detail.type);
            $rootScope.variableCategory = categoryMap.get($rootScope.detail.category);
            $rootScope.variableStatus = $rootScope.detail.status;
            $rootScope.variableSource = $rootScope.detail.source;
            $rootScope.variableDescription = $rootScope.detail.desc;
            $rootScope.variableId = $rootScope.detail.id;
        });
    }

    $scope.treeView = function (varData) {
        console.log(varData);
        var initSearchableTree = function () {

            $('#treeview-searchable').treeview({
                data: varData,
                expandIcon:'glyphicon glyphicon-chevron-right',
                collapseIcon:'glyphicon glyphicon-chevron-down',
                nodeIcon:'glyphicon glyphicon-bookmark',
                multiSelect: $('#chk-select-multi').is(':checked'),
                onNodeSelected: function (event, node) {
                    $scope.showDetail(node.text);
                }
            });
        }
        var $searchableTree = initSearchableTree();

        var search = function (e) {
            var pattern = $('#input-search').val();
            var options = {
                ignoreCase: true,
                revealResults: true
            };
            var results = $('#treeview-searchable').treeview('search', [pattern, options]);
            var output = '<p>' + results.length + ' matches found</p>';
            $.each(results, function (index, result) {
                output += '<p >' + result.text + '</p>';
            });
            $('#treeview-searchable').html(output);
            var nodep = document.getElementsByTagName("p");
            for (var i = 0; i < nodep.length; i++) {
                nodep[i].onclick = function (d) {
                    $scope.showDetail(this.innerHTML);
                    console.log(this.innerHTML);

                }
            }
        }
        $('#input-search').on('keyup', search);
        $('#btn-clear-search').on('click', function (e) {
            $searchableTree.treeview('clearSearch');
            $('#input-search').val('');
            $('#treeview-searchable').html('');
            $('#treeview-searchable').treeview({
                data: varData,
                onNodeSelected: function (event, node) {
                    $scope.showDetail(node.text);
                }
            });
        });
        $('#chk-select-multi:checkbox').on('change', function () {
            console.log('multi-select change');
            $searchableTree = initSearchableTree();
        });
    }
})
;


myApp.controller('updateV', function ($scope, $http, $rootScope) {

    $scope.addSubmit = function () {
        var name = $("#variableNameN").val();
        var type = $("#variableTypeN").val().split("-")[1];
        var category = $("#variableCategoryN").val().split("-")[1];
        var status = $("#variableStatusN").val();
        var source = $("#variableSourceN").val();
        var description = $("#variableDescriptionN").val();

        $http.get('/api/addVariable', {
            params: {
                "name": name,
                "type": type,
                "category": category,
                "description": description,
                "source": source,
                "status": status
            }
        }).success(function (data) {
            if (data.status == "ok") alert("变量添加成功！");
        }).error(function () {
            console.log("error");
        });
    }
});

myApp.controller('editV', function ($scope, $http, $rootScope) {
    $scope.editSubmit = function () {
        //$("#variableTypeE").find("option[text=$rootScope.variableType]").attr("selected",true);
        // $("variableCategoryE").find("option[text=$rootScope.variableCategory]").attr("selected",true);

        var name = $("#variableNameE").val();
        var type = $("#variableTypeE").val().split("-")[1];
        var category = $("#variableCategoryE").val().split("-")[1];
        var status = $("#variableStatusE").val();
        var source = $("#variableSourceE").val();
        var description = $("#variableDescriptionE").val();
        var id = $rootScope.variableId;

        $http.get('/api/editVariable', {
            params: {
                "name": name,
                "id": id,
                "type": type,
                "category": category,
                "description": description,
                "source": source,
                "status": status
            }
        }).success(function (data) {
            if (data.status == "ok") alert("变量修改成功！");
        }).error(function () {
            console.log("error");
        });
    }
});