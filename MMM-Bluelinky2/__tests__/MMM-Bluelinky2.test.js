describe('MMM-Bluelinky2 Module', () => {
  let module;

  beforeEach(() => {
    // Mock the Module global
    global.Module = {
      register: jest.fn((name, moduleDefinition) => {
        module = moduleDefinition;
        return module;
      })
    };

    // Mock the Log global
    global.Log = {
      info: jest.fn()
    };

    // Load the module
    require('../MMM-Bluelinky2');

    // Patch sendSocketNotification on the module instance
    module.sendSocketNotification = jest.fn();
  });

  test('module should be registered with correct name', () => {
    expect(Module.register).toHaveBeenCalledWith('MMM-Bluelinky2', expect.any(Object));
  });

  test('defaults should have correct values', () => {
    expect(module.defaults).toEqual({
      wakeOnModuleLoad: false,
      wakeOnRefresh: false,
      showLastUpdated: true,
      region: 'US',
      refreshIntervalWhileCharging: 1000 * 60 * 10, // update every 10 minutes
      refreshIntervalWhileDisconnected: 1000 * 60 * 60 // update every 60 minutes
    });
  });

  test('start function should initialize module', () => {
    module.name = 'MMM-Bluelinky2';
    module.start();
    expect(Log.info).toHaveBeenCalledWith('Starting module: MMM-Bluelinky2');
    expect(module.loaded).toBe(false);
    expect(module.latestData).toBeDefined();
    expect(module.sendSocketNotification).toHaveBeenCalledWith('BLUELINKY2_CONFIG', module.config);
  });

  test('processVehicleData should update module state', () => {
    const mockData = {
      name: 'Test Vehicle',
      evStatus: {
        batteryCharge: true,
        batteryStatus: 80,
        drvDistance: [{
          rangeByFuel: {
            evModeRange: {
              value: 300
            }
          }
        }]
      }
    };

    module.processVehicleData(mockData);
    expect(module.vehicle_name).toBe('Test Vehicle');
    expect(module.charging_state).toBe('Charging');
    expect(module.battery_level).toBe(80);
    expect(module.range).toBe(300);
  });
}); 