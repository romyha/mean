(function () {
    angular.module('loc8rApp').controller('reviewModalCtrl', reviewModalCtrl);

    reviewModalCtrl.$inject = ['$uibModalInstance', 'locationData', 'loc8rData'];
    function reviewModalCtrl($uibModalInstance, locationData, loc8rData) {
        var vm = this;
        vm.locationData = locationData;
        
        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.formData.name || !vm.formData.rating || !vm.formData.message) {
                vm.formError = "All fields required";
                return false;
            } else {
                vm.doAddReview(vm.locationData.locationid, vm.formData);
                return false;
            }
        };
        
        vm.doAddReview = function(locationid, formData) {
            loc8rData.addReviewById(locationid, {
                author : formData.name,
                rating : formData.rating,
                message : formData.message
            }).success(function(data) {
                vm.modal.close(data);
            }).error(function(data) {
                vm.formError = "Your review has not been saved, try again";
            });
            return false;
        };
        
        vm.modal = {
            cancel: function () {
                $uibModalInstance.dismiss('cancel');
            },
            close: function(result){
                $uibModalInstance.close(result);
            }
        };
    }
})();