
const {BlueLinky} = require('bluelinky');

test('Testing Bluelinky with real data',  () => {

    const config = 
    {
        username: 'USERNAME',
        password: 'PASSWORD',
        brand: 'hyundai',
        region: 'EU',
        pin: 'PIN',
        vin: 'VIN',
        useInfo: false
    };
    
    let client = null;
    try {
        client = new BlueLinky(config);
    }
    catch (err) {
        let message = err.message;
        let usefulMessage = "";
        if (message.includes(`Your region is not supported yet.`)) {
            usefulMessage = `The value of the region in the config is not supported. Expected one of [US, EU, CA], supplied config value was ${config.region}`
            
        }
        if (message.includes(`Constructor`) && message.includes(`is not managed`)) {
            usefulMessage = `The value of the brand in the config is not supported. Expected one of [hyundai, kia], supplied config value was ${config.brand}`
            
        }
        console.log(usefulMessage);
        throw new Error(usefulMessage);
    }


    client.on('ready', async () => {

        let vehicle = null;

        //If no VIN was provided, use the first vehicle in the list and get it's VIN
        if (!config.vin || config.vin.trim() === '') {
            if (client.vehicles.length > 0) {
                config.vin = client.vehicles[0].vehicleConfig.vin;
            }
        }

        if (!config.vin || config.vin.trim() === '') {
            console.log(`No VIN was provided, and no appropriate VIN could be located.`)
            throw new Error('No VIN provided');
        }

        //Get the vehicle in question
        try {
            vehicle =  client.getVehicle(config.vin);
        }
        catch (err){
            console.log(`Unable to get the vehicle with VIN ${config.vin}.`);
            //So, invalid VIN, but what if they have exactly one vehicle?  Default to that one.
            if (client.vehicles.length === 1) {
                console.warn(`The VIN supplied in the config ${config.vin} was invalid, but since there is only a single vehicle anyway, using that one instead.`);
                config.vin = client.vehicles[0].vehicleConfig.vin;
                vehicle = client.getVehicle(config.vin);
            } else {
                console.log(`The VIN supplied in the config was invalid, and there are multiple vehicles available.  Please supply a valid VIN for the needed vehicle.`);
                throw new Error(`Unable to get the vehicle with VIN ${config.vin}.`);
            }
            
        }
        
        let started = false;

        const refresh = config.wakeOnRefresh || (!started && config.wakeOnModuleLoad);

        let statusRequest = {
            parsed: false,
            refresh: refresh
        };

        // Get non-parsed bluelinky data
        const vehicleData = await vehicle.status(statusRequest);

        // Get location
        const location = await vehicle.location();

        const newCarData = {
            ...vehicleData,
            ...location,
            name: vehicle.vehicleConfig.name + ' (' + vehicle.vehicleConfig.generation + ')',
        };
        
        /*
        try {
            const response = await vehicle.lock();
            console.log(response);
        } catch (err) {
            await errorHandler(err);
        }
            */


    });

    client.on('error', async (err) => {
        await errorHandler(err);
    });

    let errorHandler = async (err) => {
        let source = err.source;
        let statusCode = source.statusCode;
        let errorJson = source.body;
        //let errorJson = JSON.parse(jsonBody);
        let errorMessage = errorJson.errMsg;

        //Bad request
        if (statusCode == 400) {
            console.log(`Bluelink returned an error: Bad request: ${errorMessage}, likely invalid credentials.`);
        }
        //Unauthorized
        if (statusCode == 401) {
            console.log(`Bluelink returned an error: Unauthorized: ${errorMessage}`);
        }
        //Forbidden
        if (statusCode == 403) {
            console.log(`Bluelink returned an error: Forbidden: ${errorMessage}`);
        }
        //Not found
        if (statusCode == 404) {
            
        }

        console.log(`An error occurred: ${errorMessage}`);
    }

    expect(module.defaults).toEqual({
      refreshIntervalWhileDisconnected: 1000 * 60 * 60,
      refreshIntervalWhileCharging: 1000 * 60 * 10,
      wakeOnModuleLoad: false,
      wakeOnRefresh: false,
      showLastUpdated: true,
      region: 'US'
    });
  });
