/**
 * Created by aismael on 4/20/2016.
 */

"use strict";

import React, {PropTypes} from "react";
import ReactDOMServer from "react-dom/server";

/**
 *
 */
export default class IsomorphicTemplate extends React.Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * This method is for server-side rendering only!
     * @returns {XML}
     */
    render() {
        const {
            // run_mode,
            assets,
            filter_model_data,
            header_tags,
            body_class_name,
            app_element,
            // locale,
            app_script_url,
            body_end_element
        } = this.props;

        const app_mount_code = " if (typeof window !== \"undefined\" && window.document && window.document.createElement) {" +
        " var appElement = React.createElement(window.PageBundle.default,   {model: window.model}); " +
        " ReactDOM.render(appElement, window.document.getElementById(\"app-element-mountpoint\")); " +
        "}";

        const model = this.props.model || {};
        const clientInfo = model.client_info || {};
        const clientLocale = clientInfo.client_locale_language || "en";
        const clientCountry = clientInfo.client_locale_country || "US";
        const deviceType = clientInfo.client_type || "desktop";
        const lang = `${clientLocale}-${clientCountry}`;

        const sanitized_model_data = filter_model_data(model);

        const app_element_markup = ReactDOMServer.renderToString(app_element);
        const app_element_div = (<div id="app-element-mountpoint" dangerouslySetInnerHTML={{
            __html: app_element_markup
        }}/>);

        let modelVarStr = "var model = {};";
        try {
            modelVarStr = "var model = " + JSON.stringify(sanitized_model_data) + ";";
        } catch (err) {}

        const modelBrowserElement = <script dangerouslySetInnerHTML={{
            __html: modelVarStr
        }}/>;

        const html = (
            <html lang={lang} data-device-type={deviceType} className="no-js">
                <head>
                    {header_tags.map((header_tag) => header_tag)}

                    {/* Model  data */}
                    {modelBrowserElement}

                    {/* Generating link tags for css artifacts */}
                    {assets
                        .styles
                        .map((style_url, idx) => <link key={"style_" + idx} href={style_url} media="screen, projection" rel="stylesheet" type="text/css" charSet="UTF-8"/>)}
                </head>

                <body className={body_class_name}>
                    {/* support adding arbitrary markup to body start */}
                    {/*{body_top
                        ? body_top()
                    : null}*/}
                    {/* React page content */}
                    {app_element_div}

                    {/* locale for international messages */}
                    {/* <script dangerouslySetInnerHTML={{__html: `window._locale=${JSON.stringify(locale)}`}} charSet="UTF-8"/> */}

                    {/* javascripts */}
                    {assets
                        .javascript
                        .map((script_url, idx) => <script src={script_url} key={"js_script_" + idx} charSet="UTF-8"/>)}

                    {/* Main application React javascript */}
                    <script src={app_script_url} charSet="UTF-8"/>

                    {/* APP element mount code*/}
                    <script dangerouslySetInnerHTML={{
                        __html: app_mount_code
                    }} charSet="UTF-8"/>

                    {/*  */}
                    {body_end_element}
                </body>
            </html>
        );

        return html;
    }
}

/**
 * [propTypes description]
 * @type {Object}
 */
IsomorphicTemplate.propTypes = {
    run_mode: PropTypes.string,
    body_class_name: PropTypes.string,
    assets: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    app_element: PropTypes.node.isRequired,
    filter_model_data: PropTypes.func.isRequired,
    header_tags: React
        .PropTypes
        .arrayOf(React.PropTypes.node),
    locale: PropTypes.string,
    body_end_element: PropTypes.node,
    app_script_url: PropTypes.string.isRequired
};

/**
 * [defaultProps description]
 * @type {Object}
 */
IsomorphicTemplate.defaultProps = {
    run_mode: "production",
    assets: {}
    // app_element     : PropTypes.node,
    // header_tags: React.PropTypes.arrayOf(React.PropTypes.node),
    // body_start  : PropTypes.func,
    // body_end    : PropTypes.func,
    // locale      : PropTypes.string
};
