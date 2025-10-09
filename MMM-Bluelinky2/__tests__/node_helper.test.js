let mockClient;

jest.mock('bluelinky', () => {
  const BluelinkyMock = jest.fn().mockImplementation(() => mockClient);
  global.BluelinkyMock = BluelinkyMock;
  return BluelinkyMock;
});

describe('Node Helper', () => {
  let nodeHelper;
  let mockVehicle;

  beforeEach(() => {
    // Mock Bluelinky client and vehicle
    mockVehicle = {
      status: jest.fn(),
      location: jest.fn(),
      vehicleConfig: {
        vin: 'TEST123',
        name: 'Test Car',
        generation: '2023'
      }
    };

    mockClient = {
      on: jest.fn(),
      getVehicle: jest.fn().mockReturnValue(mockVehicle),
      getVehicles: jest.fn().mockReturnValue([mockVehicle])
    };

    // Mock sendSocketNotification
    global.sendSocketNotification = jest.fn();

    // Load the node helper
    nodeHelper = require('../node_helper');
    // Patch sendSocketNotification on the instance
    nodeHelper.sendSocketNotification = jest.fn();
  });

  test('start function should initialize helper', () => {
    nodeHelper.start();
    expect(nodeHelper.started).toBe(false);
    expect(nodeHelper.config).toBeNull();
    expect(nodeHelper.vehicle_data).toBeNull();
  });

  test('getData should create Bluelinky client with correct config', () => {
    const testConfig = {
      username: 'testuser',
      password: 'testpass',
      region: 'US',
      pin: '1234',
      wakeOnRefresh: false,
      wakeOnModuleLoad: false,
      refreshIntervalWhileDisconnected: 1000,
      refreshIntervalWhileCharging: 500
    };

    nodeHelper.config = testConfig;
    nodeHelper.getData();

    // Verify Bluelinky constructor was called with correct config
    expect(global.BluelinkyMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass',
      region: 'US',
      pin: '1234'
    });
  });

  test('getData should handle vehicle data and location', async () => {
    const mockVehicleData = {
      evStatus: {
        batteryCharge: false
      }
    };

    const mockLocation = {
      lat: 123,
      lng: 456
    };

    // Setup mock responses
    mockVehicle.status.mockResolvedValue(mockVehicleData);
    mockVehicle.location.mockResolvedValue(mockLocation);

    // Setup config
    nodeHelper.config = {
      refreshIntervalWhileDisconnected: 1000,
      refreshIntervalWhileCharging: 500,
      wakeOnRefresh: false,
      wakeOnModuleLoad: false
    };

    // Call getData
    nodeHelper.getData();

    // Simulate 'ready' event
    const readyCallback = mockClient.on.mock.calls[0][1];
    await readyCallback([{ vehicleConfig: { vin: 'TEST123' } }]);

    // Verify vehicle data was processed and sent
    expect(mockVehicle.status).toHaveBeenCalledWith({ parsed: false, refresh: false });
    expect(mockVehicle.location).toHaveBeenCalled();
    expect(nodeHelper.vehicle_data).toEqual({
      ...mockVehicleData,
      ...mockLocation,
      name: 'Test Car (2023)'
    });
    expect(nodeHelper.sendSocketNotification).toHaveBeenCalledWith('CAR_DATA', nodeHelper.vehicle_data);
  });

  test('getData should use correct refresh interval based on charging state', async () => {
    const mockVehicleData = {
      evStatus: {
        batteryCharge: true
      }
    };

    const mockLocation = {
      lat: 123,
      lng: 456
    };

    // Setup mock responses
    mockVehicle.status.mockResolvedValue(mockVehicleData);
    mockVehicle.location.mockResolvedValue(mockLocation);

    // Setup config
    nodeHelper.config = {
      refreshIntervalWhileDisconnected: 1000,
      refreshIntervalWhileCharging: 500,
      wakeOnRefresh: false,
      wakeOnModuleLoad: false
    };

    // Mock setTimeout
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    // Call getData
    nodeHelper.getData();

    // Simulate 'ready' event
    const readyCallback = mockClient.on.mock.calls[0][1];
    await readyCallback([{ vehicleConfig: { vin: 'TEST123' } }]);

    // Verify setTimeout was called with charging interval
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);

    // Cleanup
    setTimeoutSpy.mockRestore();
  });

  test('socketNotificationReceived should handle BLUELINKY2_CONFIG', () => {
    const testConfig = {
      username: 'testuser',
      password: 'testpass',
      region: 'US',
      pin: '1234',
      vin : 'TEST123',
      useInfo: false
    };

    // Mock getData
    nodeHelper.getData = jest.fn();

    // Test initial config
    nodeHelper.socketNotificationReceived('BLUELINKY2_CONFIG', testConfig);
    expect(nodeHelper.config).toEqual(testConfig);
    expect(nodeHelper.started).toBe(true);
    expect(nodeHelper.sendSocketNotification).toHaveBeenCalledWith('STARTED', true);
    expect(nodeHelper.getData).toHaveBeenCalled();

    // Test subsequent config
    nodeHelper.vehicle_data = { test: 'data' };
    nodeHelper.socketNotificationReceived('BLUELINKY2_CONFIG', testConfig);
    expect(nodeHelper.sendSocketNotification).toHaveBeenCalledWith('CAR_DATA', { test: 'data' });
  });

  test('socketNotificationReceived should handle REFRESH', () => {
    // Mock getData
    nodeHelper.getData = jest.fn();

    nodeHelper.socketNotificationReceived('REFRESH');
    expect(nodeHelper.getData).toHaveBeenCalled();
  });
}); 