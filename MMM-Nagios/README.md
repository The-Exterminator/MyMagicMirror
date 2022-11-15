# MagicMirror Module: MMM-Nagios

A MagicMirror Module for displaying the Nagios Network Monitoring.

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)

## Example

![](images/MMM-Nagios.png)

## Installing the module

The module uses the JSON formatted Nagios status as formattted by [php-nagios-json](https://github.com/The-Exterminator/MyMagicMirror/tree/main/MMM-Nagios/php). <br>
Copy the ```statusJson.php``` to you ```nagios/share``` folder.<br>
Remember to changes this line ```$statusFile = "/opt/local/var/nagios/status.dat";``` to yours status.dat folder.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```
modules: [
  {
    module: 'MMM-Nagios',
    position: 'top_right',
    header: 'Nagios - Services',
    config: {
      statusUrl: 'https://<YOUR URL>/statusJson.php',
      username:'Basic auth username',
      password: 'Basic auth password',
      showDetails: true,
      showHosts: false
    }
  },
  {
    module: 'MMM-Nagios',
    position: 'top_right',
    header: 'Nagios - Hosts',
    config: {
      statusUrl: 'https://<YOUR URL>/statusJson.php',
      username:'Basic auth username',
      password: 'Basic auth password',
      showDetails: true,
      showHosts: true
    }
  }
]
```

## Configuration options

The following properties can be configured:

Option           | Description
---------------- | -----------
`statusUrl`      | The URL to get the status from. Must be a php-nagios-json page.<br>**Required**
`username`       | HTTP Basic Auth username, if need to access the page.<br>**Optional**
`password`       | HTTP Basic Auth password, should be specified if the username is.<br>**Optional**
`showDetails`    | Show the service and host for each nagios status (except OK).<br>**Optional**
`showHosts`      | Show information about hosts instead of services.<br>**Default value:** `false`
`reloadInterval` | Number of milliseconds between refresh.<br>**Default value:** `5 * 60 * 1000` (5 minutes)
`labels`         | Defines the labels for each type of status.<br>**Default value:** See [Default labels](https://github.com/The-Exterminator/MyMagicMirror/blob/main/MMM-Nagios/MMM-Nagios.css).

## Notifications
```
This module supports the following notifications:

Notification   | Description
-------------- | -----------
`SHOW_DETAILS` | Payload is a `boolean` indicating if the details should be shown, just like (`showDetails` in the config).
```

## Coloring
```
.nagios-critical {
    color: red;
}

.nagios-warning {
    color: yellow;
}

.nagios-unknown {
    color: orange;
}

.nagios-ok {
    color: green;
}
```
You can of course also use these CSS classes for differente styling ```MMM-Nagios/MMM-Nagios.css```
