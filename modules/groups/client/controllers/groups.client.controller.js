'use strict';

var groupApp = angular.module('groups');

// groups controller
groupApp.controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', '$modal', '$log',
  function ($scope, $stateParams, $location, Authentication, Groups, $modal, $log) {
    $scope.authentication = Authentication;

    this.groups = Groups.query();
    // Find a list of groups
    this.init = function () {
      this.group = Groups.get({ 
        groupId: $stateParams.groupId
      });
      $log.info($stateParams.groupId);
      $log.info(this.group);

    };


    //Open a modal to create a group
    this.modalCreateGroup = function (size) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/groups/client/views/create-group.client.view.html',
          controller: function ($scope, $modalInstance){

              $scope.ok = function () {
                if(this.createGroupForm.$valid){
                  $modalInstance.close();
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal group dismissed at: ' + new Date());
        });
    };
      //end

    //Open a modal to Update 
    this.modalUpdate = function (size, selectedGroup) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/groups/client/views/edit-group.client.view.html',
          controller: function ($scope, $modalInstance, group){
            $scope.group = selectedGroup;

              $scope.ok = function () {

                if(this.updateGroupForm.$valid){
                  $modalInstance.close($scope.group);
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            group: function () {
              $log.info(selectedGroup);
              return selectedGroup;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
          $log.info(selectedGroup.name);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
      //end
    //Open a modal to create a person
    this.modalCreatePerson = function (size) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/people/client/views/create-person.client.view.html',
          controller: function ($scope, $modalInstance){

              $scope.ok = function () {
                if(this.createPersonForm.$valid){
                  $modalInstance.close();
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
      //end

    //Open a modal to create 
    this.modalAddGroup = function (size, currentGroup) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/people/client/views/people-add-template.html',
          controller: function ($scope, $modalInstance){
              $scope.ok = function () {
                  $modalInstance.close();
          };

          },
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal group dismissed at: ' + new Date());
        });
    };
      //end

    //Open a modal to create a lesson
    this.modalCreateShortLesson = function (size, currentGroup) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/lessons/client/views/create-lesson.client.view.html',
          controller: function ($scope, $modalInstance){
            $scope.currentGroup=currentGroup;

              $scope.ok = function () {
                if(this.createLessonForm.$valid){
                  $modalInstance.close();
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            currentGroup: function () {
              $log.info('currentGroupId from groupCOntroller' + currentGroup._id);
              return currentGroup;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal lesson dismissed at: ' + new Date());
        });
    };
      //end


    // Create new group
    // $scope.create = function (isValid) {
    //   $scope.error = null;

    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

    //     return false;
    //   }

    //   // Create new group object
    //   var group = new Groups({
    //     name: this.name,
    //     category: this.category
    //   });

    //   // Redirect after save
    //   group.$save(function (response) {
    //     $location.path('groups/' + response._id);

    //     // Clear form fields
    //     $scope.name = '';
    //     //$scope.category = '';
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };

    // // Remove existing group
    // $scope.remove = function (group) {
    //   if (group) {
    //     group.$remove();

    //     for (var i in $scope.groups) {
    //       if ($scope.groups[i] === group) {
    //         $scope.groups.splice(i, 1);
    //       }
    //     }
    //   } else {
    //     $scope.group.$remove(function () {
    //       $location.path('groups');
    //     });
    //   }
    // };

    // // Update existing group
    // $scope.update = function (isValid) {
    //   $scope.error = null;

    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

    //     return false;
    //   }

    //   var group = $scope.group;

    //   group.$update(function () {
    //     $location.path('groups/' + group._id);
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };

    // // Find a list of groups
    // $scope.find = function () {
    //   $scope.groups = Groups.query();
    // };

    // // Find existing group
    // $scope.findOne = function () {
    //   $scope.group = Groups.get({
    //     groupId: $stateParams.groupId
    //   });
    // };


  }
]);


groupApp.controller('GroupsCreateController', ['$scope', 'Groups', 'NotifyGroup',
  function($scope, Groups, NotifyGroup) {

    this.create = function (isValid) {
      this.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'createGroupForm');

        return false;
      }

      // Create new group object
      var group = new Groups({
        name: this.name,
        category: this.category
      });

      // Redirect after save
      group.$save(function (response) {

        // Clear form fields
        $scope.name = '';
        //$scope.category = '';
        NotifyGroup.sendMsg('NewGroup', {'id' : response._id});        
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

}]);


groupApp.controller('GroupsEditController', ['$scope', 'Groups', 'NotifyGroup', '$location',
  function($scope, Groups, NotifyGroup, $location) {

    // Update existing Group
    this.update = function(updatedGroup) {
      var group = updatedGroup;
      console.log(updatedGroup.name);
      group.$update(function() {
        
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // this.update = function (isValid, updatedGroup) {
    //   $scope.error = null;

    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

    //     return false;
    //   }

    //   var group = $scope.group;

    //   group.$update(function () {
    //     $location.path('groups/' + group._id);
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };


    // Remove existing Group
    this.remove = function(group) {
      if ( group ) { 
        group.$remove();

        for (var i in $scope.groups) {
          if ($scope.groups [i] === group) {
            $scope.groups.splice(i, 1);
          }
        }
      } else {
        $scope.group.$remove(function() {
        
        });
      }
      $location.path('groups');
      //Notify service
      //NotifyGroup.sendMsg('DeleteGroup', {'id' : group._id});
    };



}]);






//Directive

groupApp.directive('groupsList', ['Groups', 'NotifyGroup', '$log', function(Groups, NotifyGroup, $log){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl:'modules/groups/client/views/groups-list-template.html',
    link: function(scope, element, attrs){
      //When new group is added, update
      NotifyGroup.getMsg('NewGroup', function(event, data){
        $log.info('notifyGroup receive NewGroup');
        scope.groupsCtrl.groups = Groups.query();
      });
      //When new person is added, update
      NotifyGroup.getMsg('AddPeopleToGroup', function(event, data){
        scope.groupsCtrl.groups = Groups.query();
        $log.info('notifyGroup receive AddPeopleToGroup');
      });
      //When Group, update
      NotifyGroup.getMsg('DeleteGroup', function(event, data){
        scope.groupsCtrl.groups = Groups.query();
        $log.info('notifyGroup receive DeleteGroup');
      });
    }
  };
}]);

