import ability_featureAbility from '@ohos.ability.featureAbility'

export default {
    onCreate() {
        console.info('AceApplication onCreate');
        //requestPermission()
    },
    onDestroy() {
        console.info('AceApplication onDestroy');
    }
};

function requestPermission() {
    var context = ability_featureAbility.getContext();
    let permissions = ["ohos.permission.ACTIVITY_MOTION"];
    let requestCode = 123
    context.requestPermissionsFromUser(permissions, requestCode)
        .then((data) => {
            console.info('Permission Granted')
        }).catch((error) => {
        console.error('Permission Denied')
    })
}
