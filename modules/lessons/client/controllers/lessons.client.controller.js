'use strict';

var lessonApp = angular.module('lessons');
// Lessons controller
lessonApp.controller('LessonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lessons', 'Groups', '$modal', '$log',
  function($scope, $stateParams, $location, Authentication, Lessons, Groups, $modal, $log) {
    this.authentication = Authentication;

    this.lessons = Lessons.query();
    this.currentLesson={};
    this.showGroup = true;

    // $scope.totalItems = 80;

    // $scope.currentPage = 4;

    // this.setPage = function (pageNo) {
    // $scope.currentPage = pageNo;
    // };

    // this.pageChanged = function() {
    // $log.info('Page changed to: ' + $scope.currentPage);
    // };

    // $scope.maxSize = 1;
    // $scope.bigTotalItems = 175;
    // $scope.bigCurrentPage = 1;
    this.showGroupAndClear=function(show){
      this.showGroup=true;
      this.currentLesson={};
    };

    this.lessonChanged=function(lesson){
      $log.info('currentLesson: ' +lesson.name);
      this.currentLesson=lesson;
      this.showGroup = false;
    };




    // Remove existing Lesson
    $scope.remove = function(lesson) {
      if ( lesson ) { 
        lesson.$remove();

        for (var i in $scope.lessons) {
          if ($scope.lessons [i] === lesson) {
            $scope.lessons.splice(i, 1);
          }
        }
      } else {
        $scope.lesson.$remove(function() {
          $location.path('lessons');
        });
      }
    };

    // Update existing Lesson
    $scope.update = function() {
      var lesson = $scope.lesson;

      lesson.$update(function() {
        $location.path('lessons/' + lesson._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Lessons
    $scope.find = function() {
      $scope.lessons = Lessons.query();
    };

    // Find existing Lesson
    $scope.findOne = function() {
      $scope.lesson = Lessons.get({ 
        lessonId: $stateParams.lessonId
      });
    };
  }
]);

lessonApp.controller('LessonsUpdateController', ['$scope', 'Lessons', 
  function($scope, Lessons) {


  //Add a group to the person
  this.updateStatus = function(currentLesson,person,status){
    var lesson = currentLesson;
    var newStatus=0;
    switch(status){
      case 0: 
        newStatus=1;
        break; 
      case 1: 
        newStatus=2;
        break; 
      case 2: 
        newStatus=3;
        break; 
      case 3: 
        newStatus=0;
        break; 
    }
    // var _ = require('lodash');
    
    var studentToUpdate ={};
    // var currentStudent = _.find(lesson.students, { 'id': person._id });
    for (var i in lesson.students) {
      if (lesson.students[i].person === person._id) {
        lesson.students[i].status = newStatus;
        studentToUpdate = lesson.students[i];
        // console.log('updateStatus: ');
        // console.log(studentToUpdate);

      }
    }

    // Lessons.updateStudent({'students._id': studentToUpdate._id},
    // {
    //   '$set':{
    //     'students.status.$.post': studentToUpdate.status
    //   }
    // }, function(errorResponse){
    //   $scope.error = errorResponse.data.message;
    // });

    lesson.$update(function() {
      // $location.path('people/' + person._id);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });


  };

}]);


lessonApp.controller('LessonsCreateController', ['$scope', 'Lessons', 'PeopleGroup', 'NotifyLesson', '$log', '$state', 
  function($scope, Lessons, PeopleGroup, NotifyLesson, $log, $state) {

    function createStudent(person, status) {

      return {
        person: person,
        status: status
      };
    }
      // Create new Group
    this.createShortLesson = function(currentGroupId) {
      

      $scope.peopleByGroup = PeopleGroup.Groups.query({id:currentGroupId});

      var now = Date.now();
      // Create new Group object
      var lesson = new Lessons ({
        name: this.name,
        createDate: now, 
        beginDate: now, 
        endDate: now,
        students: [],
        groups: []
      });


      lesson.groups.push(currentGroupId);
      PeopleGroup.Groups.query({id:currentGroupId}, function(data){
        for (var i = 0; i < data.length; i++) {
          $log.info(data[i]._id);
          lesson.students.push({
            person: data[i]._id, 
            status: 0
          });
        }

        // Redirect after save
        lesson.$save(function(response) {
          // Clear form fields
          $scope.name = '';
          
          NotifyLesson.sendMsg('NewLesson', {'id' : response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });



      });

    };

}]);


//FIlter
lessonApp.filter('filterByGroupId', function() {
    return function(lessons, currentGroup) {
        return lessons.filter(function(lesson) {
      //console.log('person: ' + person.firstname + ' | groupId: '+ person.groups);
            for (var i in lessons.groups) {
                if (currentGroup.indexOf(lesson.groups[i]) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
});

lessonApp.filter('filterByLessonId', function() {
    return function(lessons, currentLesson) {
        return lessons.filter(function(lesson) {
      //console.log('person: ' + person.firstname + ' | groupId: '+ person.groups);
            for (var i in lessons) {
                if (currentLesson.indexOf(lesson[i]) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
});


lessonApp.directive('listLessons', ['Lessons', 'NotifyLesson', function(Lessons, NotifyLesson){
  return {
    restrict: 'E',
    transclude: true,
    //controller: 'PeopleByLessonController'
    templateUrl:'modules/lessons/client/views/list-lessons-template.html',
    link: function(scope, element, attrs){
      //When new person is added, update
       NotifyLesson.getMsg('NewLesson', function(event, data){
        console.log('notify receive NewLesson');
        scope.lessonsCtrl.lessons = Lessons.query();        
       });
    }
  };
}]);
