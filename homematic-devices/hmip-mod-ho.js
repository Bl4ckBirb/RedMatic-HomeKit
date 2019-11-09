const Accessory = require('./lib/accessory');

module.exports = class HmipModHo extends Accessory {
    init(config, node) {
        const {ccu} = node;

        /*
            DOOR_STATE
                CLOSED
                OPEN
                VENTILATION_POSITION
                POSITION_UNKNOWN

            DOOR_COMMAND
                NOP
                OPEN
                STOP
                CLOSE
                PARTIAL_OPEN

            // The value property of CurrentDoorState must be one of the following:
                static readonly OPEN = 0;
                static readonly CLOSED = 1;
                static readonly OPENING = 2;
                static readonly CLOSING = 3;
                static readonly STOPPED = 4;

            // The value property of TargetDoorState must be one of the following:
                static readonly OPEN = 0;
                static readonly CLOSED = 1;
         */

        const service = this.addService('GarageDoorOpener', config.name);

        let currentDoorState;
        let targetDoorState;

        service.get('CurrentDoorState', config.deviceAddress + ':1.DOOR_STATE', value => {
            switch (value) {
                case 0:
                    currentDoorState = 1;
                    targetDoorState = 1;
                    break;
                case 1:
                    currentDoorState = 0;
                    targetDoorState = 0;
                    break;
                case 2:
                    currentDoorState = 4;
                    break;
                default:
                    currentDoorState = 4;
                    // Obstruction
            }

            return currentDoorState;
        })

            .get('TargetDoorState', config.deviceAddress + ':1.DOOR_STATE', value => {
                switch (value) {
                    case 0:
                        currentDoorState = 1;
                        targetDoorState = 1;
                        break;
                    case 1:
                        currentDoorState = 0;
                        targetDoorState = 0;
                        break;
                    case 2:
                        currentDoorState = 4;
                        break;
                    default:
                        currentDoorState = 4;
                    // Obstruction
                }

                return targetDoorState;
            })

            .set('TargetDoorState', config.deviceAddress + ':1.DOOR_COMMAND', value => {
                switch (value) {
                    case 0:
                        return 'OPEN';
                    case 1:
                        return 'CLOSE';
                }
            });
    }
};
