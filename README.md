# valde-hapi

## What The valde-hapi Platform Provides
valde-hapi is a configuration-driven platform, based on [hapi framework version >= 17](https://hapijs.com/), which you can use to create a production-ready skeleton application in a few minutes, simply start with the sample_app, modify the config files,  and add your react and/or dust web application pages in place.

The valde-hapi platform offers configurable features, using valde-hapi plugins, and plugins published by other contributors. valde-hapi provides the following features:
1. Page URL resolution for internationalization supports based on cookies and user-agent header.
2. Development environments for React and dust web applications, which automatically compiles and packages the web pages/applications when the platform is running in development mode.
3. Encrypted HTTPS-only session cookie support using [hapi-auth-cookie](https://www.npmjs.com/package/hapi-auth-cookie).
4. Basic authentication support using [hapi-auth-basic](https://www.npmjs.com/package/hapi-auth-basic).
5. Bearer authentication using jwt tokens
6. CSRF protection by means of requiring the submission of a decorative CSRF HTTP header that must match the one included in the encrypted session cookie.
7. Locale-based/internationalization of resource resolution for both Rest API, and web page requests.


## valde-hapi Configuration
The _config_ folder, which must be created immediately under the root folder of the application, must contain at least the _config.json_ file.  This json file contains the configuration parameters for the valde-hapi web application when running in production mode.  Additionally, the _config_ folder may contain a development mode configuration file named _development.json_, and another one for staging mode, named _staging.json_.

When the valde-hapi web application is running in development or staging mode, the configuration parameters in the _development.json_ or _staging.json_ will override the ones in the production mode _config.json_, respectively.

The _config.json_ configuration file must have the following top-level parameters (please refer to the sample_app/config/config.json file for an example):

```javascript
{
    "PORT": 8000, //the port number for the web application to listen to
    "app_root": "/sample_app", //the URL application root
    "app_url_domain": "sampleapp.com", //the URL domain of the web app
    "external_server_url": "https://localhost.sampleapp.com:8443",
    "PID_FILE_PATH": "/var/run/sample_app.pid",
    "platform": {
        "plugins": {
            ... // platform plugin configurations as documented below
        },

        "static_resources_path": "./public" //path to the static resources folder
    },
    "router": {
        "module": {
            "name": "/lib/router", //path to the application router code
            "params": {}
        }
    },
    "app": {
        "plugins": {
            ... //application plugin configurations - see the sample_app for an example
        },
        .... //other application-specific configurations.
    }
}
```

All the features integrated into the platform are implemented as HAPI plugins, which can be configured without any need to change the code. The configuration parameters for each plugin are listed in the following subsections.

### valde_csrf_agent
When the CSRF plugin is enabled on an endpoint, the plugin checks for the header, named as per the  respective configuration entry *csrf_header_name*, and asserts that its value is identical to the one in the encrypted session cookie. This is an implementation of CSRF protection by means of encrypted header+cookie.  The configuration of the CSRF plugin is an entry in the platform.plugins (described above), which includes the following parameters:

```javascript
"valde_csrf_agent": {
                "csrf_header_password": "some strong CSRF password 123456789012345678901234567890",
                "csrf_header_name": "sa-decorator",
                "enabled_by_default": false //if false, it can be selectively enabled for each endpoint
            },
```

### valde_auth_bearer_jwt

### valde_locale_resolver

### valde_resource_set

### valde_visitor_tracking

### valde_web_model

CSRF protection by means of using a decoration HTTP header that must match what is in the encrypted session cookie.
4. Bearer authentication


## Directory Structure of The valde-hapi Web Application
The sample_app is provided as an example of a typical valde-hapi web application, which must have the following sub-folders under the application root:

### config
This folder contains the json configuration files for various run-time environments.  The configuration files must be named as follows:
1. config.json:  A mandatory configuration file with values used in production environment, as described in the valde-hapi Configuration Section above.  The included values are overridden in development or staging modes by the respective conffiguration files described below.
2. development.json:  An optional configuration file with values to be used when the application is running in development mode.
3.  staging.json:  An optional configuration file with values to be used when the application is running in staging mode.



## License
Apache-2
