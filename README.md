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

## Configuring The Platform plugins
The follwing subsections describe the configuration elements for the various plugins provided with the *valde-hapi* platform.  The configuration file of the  *sample_app* also includes configuration for the *hapi_auth_basic* and *hapi_auth_cookie* plugins, which are necessary for the *valde-hapi* plugins to work. Both of *hapi_auth_cookie* and *hapi_auth_basic* plugins are necessary for the *valde-hapi* platform to work correctly.

### valde_csrf_agent
When the CSRF plugin is enabled on an endpoint, the plugin checks for the header, named as per the  respective configuration entry *csrf_header_name*, and asserts that its value is identical to the one in the encrypted session cookie. This is an implementation of CSRF protection by means of encrypted header+cookie.  The configuration of the CSRF plugin is an entry in the platform.plugins (described above), which includes the following parameters:

```javascript
"valde_csrf_agent": {
    "csrf_header_password": "some strong CSRF password 123456789012345678901234567890",
    "csrf_header_name": "sa-decorator",
    "enabled_by_default": false //if false, it can be selectively enabled for each endpoint
}
```

### valde_auth_bearer_jwt
When the JWT plugin is enabled on an endpoint, the plugin will enforce that the "authorization" header is present, and that its value is of the structure:

> authorization: Bearer <<jwt-token>>

Then, the JWT plugin will authenticate:
1. The signature on the <<jwt-token>>
2. The valid time of the <<jwt-token>>
3. The issuer in the <<jwt-token>>

and will return an authorization error response if any of the above elements in the <<jwt-token>> is invalid.

```javascript
"valde_auth_bearer_jwt": {
    "verification_key": "some strong token password  123456789012345678901234567890",
    "bearer_jwt_validation_module": "/lib/auth/bearer_jwt",
    "verify_attributes": {
        "algorithms": ["HS256"],
        "audience": "12345",
        "issuer": "sample_corp.com",
        "subject": "sample_corp"
    }
}
```

### valde_locale_resolver
The *valde_locale_resolver* is necessary for the *valde-hapi* platform to work correctly. Its configuration is a simple array of supported locales, as described in the following snippet:

```javascript
"valde_locale_resolver": {
    "supported_locales": [
        "en-US",
        "en-GB",
        "fr-FR",
        "de-DE",
        "es-ES",
        "pt-PT",
        "da-DK",
        "nl-NL",
        "sv-SE",
        "zh-CN",
        "hi-IN",
        "it-IT",
        "ja-JP"
    ]
},

```


### valde_visitor_tracking
This plugin will crete and maintain an encrypted, HTTP only, cookie that is intended for tracking purposes.  The configuration elements include:
1. Cookie named
2. Encryption login_password, mandatory
3. Time to live in **seconds**.

```javascript
"valde_visitor_tracking": {
    "vt_cookie_password": "some strong visitor tracking password 123456789012345678901234567890",
    "tracking_cookie_name": "vtid",
    "ttl": 315360000
}
```

### valde_resource_set
This plugin will add locale-specific content to the request prior to invoking the **REST-endpoint** or **web-request** handlers.  The locale-specific content is added to the request object under the path:  **request.plugins.valde_resource_set**.  The endpoint handler (REST or web request) can utilize the localized content during the request processing as needed.

The localized content is served from a file named *resource_set.json* under the path **app_root/WebComponents/resource_sets** in accordance with the resolved locale for the underlying request.  For example, if the resolved locale for the request is *en-US*, the localized resource set content is loaded from the following path:
> {app_root}/WebComponents/resource_sets/US/en/resource_set.json

```javascript
"valde_resource_set": {
}
```

### valde_web_model
Web requests are the ones that target web pages, as opposed to the ones that target REST endpoints.  When the *valde-hapi* platform received a request targeting a URL of the form:
> {http | https}://{app_url_domain}/{app_root}/{url-sub-path}

the *valde-hapi* platform will attempt to find a file named **metadata.json** under the path:
> {app_root}/WebComponents/pages/US/en/{url-sub-path}/metadata.json

The **metadata.json** is a descriptor for the web page to serve.  **valde-hapi** expects the  folder structure of the page to be as follows:

<pre>
{app_root_folder}
└── WebComponents
    ├── pages
    ..........
    ..........
    │   │      
    │   └── US
    │       └── en
    │           ├── error  ////this page is served for the request: {http | https}://{app_url_domain}/{app_root}/error when the resolved locale is en-US
    │           │   ├── metadata.json
    │           │   ├── page.dust  //this is a dust template based page
    │           │   └── resources
    │           │       ├── content.json //page-specific content
    │           │       ├── css
    │           │       │   └── page.css //page-specifc css
    │           │       ├── js
    │           │       │   └── page.js //page-specific javascript resource
    │           │       └── less
    │           │           └── page.less //page-specific less resource
    ..........
    ..........
    │           ├── home  //this page is served for the request: {http | https}://{app_url_domain}/{app_root}/home when the resolved locale is en-US
    │           │   ├── metadata.json
    │           │   ├── page.jsx //this is a react (JSX) page
    │           │   └── resources
    │           │       ├── content.json
    │           │       ├── content.json //page-specific content
    │           │       ├── css
    │           │       │   └── page.css //page-specifc css
    │           │       ├── js
    │           │       │   └── page.js //page-specific javascript resource
    │           │       └── less
    │           │           └── page.less //page-specific less resource
    │           ├── resources
    │           │   └── context.json
    ..........
    ..........

</pre>

This plugin will add locale-specific content to the web request prior to invoking the **web-request** handlers.  The locale-specific content is added to the request object under the path:  **request.plugins.valde_web_model**.  The  web request handler can utilize the localized content during the request processing as needed.

```javascript
"valde_resource_set": {
}
```

```javascript
"valde_web_model": {
}
```

CSRF protection by means of using a decoration HTTP header that must match what is in the encrypted session cookie.
4. Bearer authentication


## Directory Structure of The valde-hapi Web Application
The sample_app is provided as an example of a typical valde-hapi web application, which must have the following sub-folders under the application root:

### config
This folder contains the json configuration files for various run-time environments.  The configuration files must be named as follows:
1. config.json:  A mandatory configuration file with values used in production environment, as described in the valde-hapi Configuration Section above.  The included values are overridden in development or staging modes by the respective conffiguration files described below.
2. development.json:  An optional configuration file with values to be used when the application is running in development mode.
3.  staging.json:  An optional configuration file with values to be used when the application is running in staging mode.

<pre>
{app_root_folder}
    ├── config
    │   ├── config.json
    │   ├── development.json
    │   ├── logger_config.json
    │   └── staging.json
</pre>

### public
This is where the public resources (js, css, images, fonts, etc.) are served from.  This folder is necessary, as the *valde-hapi* platform will save generated, bundled javascript files for the web pages (dust or react artifacts) in this folder.  Here is the structure of this folder:

<pre>
{app_root_folder}
    ├── public
    │   ├── css
    │   │   ├── global.css
    │   │   └── pages
    │   │       └── US
    │   │           └── en
    │   │               ├── home
    │   │               │   └── page.css //css for the home page generated by compiling the respective page.less file
    ..........
    ..........
    │   └── js
    │       ├── pages
    │       │   ├── DE
    │       │   │   └── de
    │       │   │       └── home
    │       │   │           └── page.js // bundled javascript for the respective page
    │       │   └── US
    │       │       └── en
    │       │           ├── error
    │       │           │   └── page.js // bundled javascript for the respective
    │       │           ├── home
    │       │           │   └── page.js // bundled javascript for the respective
    ..........
    ..........


</pre>


### WebComponents
This is the folder containing the web pages and resources for REST endpoints.  The structure of the folder content is listed  in the description of the *valde_web_model* plugin configuration above.



## License
Apache-2
