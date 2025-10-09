# MMM-Bluelinky2
Show Hyundai EV car data on your Magic Mirror using BlueLinky npm package. The MMM-Bluelinky2 module is based on the [MMM-Bluelinky](https://github.com/kstolk/MMM-Bluelinky) module, which itself is based on the [MMM-Tesla2](https://github.com/martinburheimtingstad/MMM-Tesla2/) module.

## Installation
```bash
cd ~/MagicMirror/modules
```

```bash
git clone https://github.com/ilenhart/MMM-Bluelinky2.git
```

```bash
cd MMM-Bluelinky2 && npm install
```

## Configuration
Copy the example config to your MagicMirror config file:

```javascript

{
  module: 'MMM-Bluelinky2',
  position: 'bottom_left',	// This can be any of the regions.
  config: {
    name: 'Optional Car Name',
    username: 'your-bluelink-email',
    password: "your-bluelink-password",
    region: 'EU',
    pin: '0123',
    vin: 'your-car-vin' //Optional.  If not supplied or invalid, chooses your first (or only) car
    refreshIntervalWhileDisconnected:  1000 * 60 * 60, // 60 minutes,
    refreshIntervalWhileCharging: 1000 * 60 * 5, // 5 minutes
    refreshIntervalWhileUnderBatteryLevel:1000 * 60 * 5, // 5 minutes
    underBatteryLevelAmount: 50 //50% charged, etc.
  }
},
```
| key  | Required | Description | Default |
| - | - | - | - |
| username  | yes  | Your bluelink username |  |
| password  | yes | Your bluelink password | |
| pin  | yes | The pin you use to refresh bluelink data in the app |   |
| vin  | no | VIN of your car. If not supplied, chooses the first (or only) car you have. |   |
| region| yes | `EU` `CA` or `US` | `US` |
| name | no | Optional name | |
| refreshIntervalWhileDisconnected | no | When should the data be refreshed when not charging? | `1000 * 60 * 60` (60 minutes) |
| refreshIntervalWhileCharging | no | When should the data be refreshed when the car is charging? | `1000 * 60 * 5` (5 minutes) |
| refreshIntervalWhileUnderBatteryLevel | no | How often to refresh when battery is under a certain level | `1000 * 60 * 5` (5 minutes) |
| underBatteryLevelAmount | no | The level for the previous refresh interval to use | 50 |
| wakeOnModuleLoad | no | When true, on initial module load the car will be woken up when in sleep mode to get the latest data | `false` |
| wakeOnRefresh | no | When set to true, the car will be woken up every time the module refreshes his data (see refreshInterval) | `false` |
| showLastUpdated | no | Show 'Updated 4 minutes ago' at the bottom | `true` |

## Preview
![Test Image 3](/preview.jpg)
Left Hyundai Ioniq example without custom name. As you can see this module is based on the [MMM-Tesla2](https://github.com/martinburheimtingstad/MMM-Tesla2/) module on the right.

## BlueLinky
This package uses [bluelinky](https://github.com/Hacksore/bluelinky). It is an unoffcial nodejs API wrapper for Hyundai BlueLink.
This is a fork of [MMM-BlueLinky](https://github.com/kstolk/MMM-Bluelinky), as some updates were needed.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
