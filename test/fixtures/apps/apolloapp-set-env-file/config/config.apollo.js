const Apollo = require('../../../../../app/lib/apollo').default;

/**
 * @param {Apollo} apollo
 */
module.exports = async apollo => {
    // console.log('apollo.get(\'TEST\')', apollo.get('TEST'));
    apollo.on('config.updated', (data) => {
        console.log('config.updated', data);
    })
    await apollo.startNotification({
        cluster_name: 'default',
        namespace_name: 'creek.tenant.locale.default.json',
        notifications: [{
            namespaceName: 'creek.tenant.locale.default.json',
            notificationId: 0,
        }]
    });
    return {};
}