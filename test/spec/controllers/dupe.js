'use strict';

describe('Controller: DupeCtrl', function () {

  // load the controller's module
  beforeEach(module('superduperApp'));

  var DupeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DupeCtrl = $controller('DupeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
