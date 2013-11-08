/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 10/31/13
 * Time: 10:02 AM
 * To change this template use File | Settings | File Templates.
 */

module.exports = {
    db: {
        poolsize: 3,
        //connectionurl: 'mongodb://webadmin:27017,192.168.1.200:27017,appserverdev:27017/angular_events',

        connectionurl: 'mongodb://192.168.1.200:27017/angular_events',
        ip: 'appserverdev',
        //ip: 'localhost',
        name: 'Something',
        port: 27017
    },
    collections: {
        events: 'Events',


        winstonLogCollection: 'ApplicationLogs',
        systemStatus: 'SystemStatus'
    },
    rs: {
        ip01: '192.168.1.200',
        ip02: '192.168.1.200',
        ip03: '192.168.1.200',
        port01: 27017,
        port02: 27017,
        port03: 27017
    },
    mongoose: 'mongodb://webadmin:27017/angular_events'
};

